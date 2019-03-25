import Enum
import IO

number_of_tasks = 10
simulation_timespan = 10_000_000
process_evaluation_cost = 10..100_000

each(1..number_of_tasks, fn _ ->
  puts("#{random(0..simulation_timespan)},#{random(process_evaluation_cost)}")
end)
