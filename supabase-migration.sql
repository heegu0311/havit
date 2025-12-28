-- Supabase 데이터베이스 스키마 및 RLS 정책
-- 이 스크립트를 Supabase 대시보드의 SQL Editor에서 실행하세요

-- 1. habits 테이블 생성
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. habit_dates 테이블 생성
CREATE TABLE IF NOT EXISTS public.habit_dates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(habit_id, date)
);

-- 3. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_created_at ON public.habits(created_at);
CREATE INDEX IF NOT EXISTS idx_habit_dates_habit_id ON public.habit_dates(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_dates_date ON public.habit_dates(date);

-- 4. updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. habits 테이블의 updated_at 트리거
DROP TRIGGER IF EXISTS update_habits_updated_at ON public.habits;
CREATE TRIGGER update_habits_updated_at
    BEFORE UPDATE ON public.habits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Row Level Security (RLS) 활성화
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_dates ENABLE ROW LEVEL SECURITY;

-- 7. habits 테이블 RLS 정책
-- 사용자는 자신의 습관만 조회 가능
CREATE POLICY "Users can view their own habits"
    ON public.habits
    FOR SELECT
    USING (auth.uid() = user_id);

-- 사용자는 자신의 습관만 생성 가능
CREATE POLICY "Users can create their own habits"
    ON public.habits
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 습관만 수정 가능
CREATE POLICY "Users can update their own habits"
    ON public.habits
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 습관만 삭제 가능
CREATE POLICY "Users can delete their own habits"
    ON public.habits
    FOR DELETE
    USING (auth.uid() = user_id);

-- 8. habit_dates 테이블 RLS 정책
-- 사용자는 자신의 습관의 날짜만 조회 가능
CREATE POLICY "Users can view dates of their own habits"
    ON public.habit_dates
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.habits
            WHERE habits.id = habit_dates.habit_id
            AND habits.user_id = auth.uid()
        )
    );

-- 사용자는 자신의 습관의 날짜만 생성 가능
CREATE POLICY "Users can create dates for their own habits"
    ON public.habit_dates
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.habits
            WHERE habits.id = habit_dates.habit_id
            AND habits.user_id = auth.uid()
        )
    );

-- 사용자는 자신의 습관의 날짜만 삭제 가능
CREATE POLICY "Users can delete dates of their own habits"
    ON public.habit_dates
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.habits
            WHERE habits.id = habit_dates.habit_id
            AND habits.user_id = auth.uid()
        )
    );





