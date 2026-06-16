UPDATE public.cycle_history
SET cycle_name = 'C' || (substring(cycle_name from 2)::int - 1)
WHERE cycle_name ~ '^C[0-9]+$';