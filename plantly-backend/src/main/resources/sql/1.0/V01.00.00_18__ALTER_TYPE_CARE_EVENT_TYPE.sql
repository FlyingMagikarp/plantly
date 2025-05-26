ALTER TYPE public.care_event_type
    ADD VALUE 'acquired' AFTER 'checking';
ALTER TYPE public.care_event_type
    ADD VALUE 'removed' AFTER 'acquired';
ALTER TYPE public.care_event_type
    ADD VALUE 'other' AFTER 'removed';