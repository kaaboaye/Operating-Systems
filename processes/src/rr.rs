use std::collections::{BTreeMap, LinkedList};

use config::simulation_mode_config::SimulationModeConfig;
use tasks::get_tasks;

pub fn start(config: SimulationModeConfig) {
    println!("Starting Round-robin simulation");

    let mut state = State::new(config, get_tasks());
    state.run();


    println!("Simulation FINISHED");
    println!("\tSimulation took {} ticks", state.current_time);
    println!("\tExecuted {} tasks", state.executed_tasks_amount);
    println!("\tTotal waiting time: {} ticks", state.waiting_time);
    println!("\tAverage waiting time: {} ticks",
             state.waiting_time as f64 / state.executed_tasks_amount as f64);
}

#[derive(Clone)]
struct RunningTask {
    spawn_at: i64,
    cost: i64,
    initial_cost: i64,
}

struct State {
    tasks: Box<BTreeMap<i64, Vec<i64>>>,
    config: SimulationModeConfig,
    queue: LinkedList<RunningTask>,
    current_time: i64,
    waiting_time: i64,
    executed_tasks_amount: i64,
}

impl State {
    fn new(config: SimulationModeConfig, tasks: Box<BTreeMap<i64, Vec<i64>>>) -> State {
        State {
            current_time: 0,
            waiting_time: 0,
            executed_tasks_amount: 0,
            queue: LinkedList::new(),
            config,
            tasks,
        }
    }

    fn run(&mut self) {
        for (&spawn_at, costs) in self.tasks.iter() {
            // execute queue
            while self.queue.len() != 0 && self.current_time < spawn_at {
                print(self);

                for mut task in &mut self.queue {
                    if self.current_time >= spawn_at { break; }

                    // init new task
                    if task.cost == task.initial_cost {
                        self.current_time += self.config.process_boot_time;
                    }

                    task.cost -= self.config.robin_time_window;
                    let minus_extra_time_left = if task.cost < 0 { task.cost } else { 0 };
                    let took = self.config.robin_time_window + minus_extra_time_left;

                    self.current_time += took + self.config.process_interruption_time;

                    // finish task if nothing is left to do
                    if task.cost <= 0 {
                        self.executed_tasks_amount += 1;
                        self.waiting_time += self.current_time - task.spawn_at - task.initial_cost;
                        self.current_time += self.config.process_finish_time;
                        continue;
                    }
                }

                self.queue = self.queue.iter()
                    .filter(|task| { task.cost > 0 })
                    .cloned()
                    .collect();
            }

            // jump forward in time if idle
            if self.current_time < spawn_at {
                self.current_time = spawn_at
            }

            // add new tasks to the queue
            for &cost in costs {
                self.queue.push_back(RunningTask { spawn_at, cost, initial_cost: cost });
            }
        }
    }
}

fn print(ref state: &State) {
    println!("‍🌈");
    println!("current_time: {}", state.current_time);
    println!("waiting_time: {}", state.waiting_time);
    println!("executed_tasks_amount: {}", state.executed_tasks_amount);
    for task in state.queue.iter() {
        println!("task {}, {}", task.spawn_at, task.cost)
    }
}