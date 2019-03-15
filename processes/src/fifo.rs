use std::collections::BTreeMap;

use config::simulation_mode_config::SimulationModeConfig;
use tasks::get_tasks;

pub fn start(config: SimulationModeConfig) {
    println!("Starting First in First out simulation");

    let tasks = get_tasks(&config);

    let mut state = State::new(config, tasks);
    state.run();

    println!("Simulation FINISHED");
    println!("\tSimulation took {} ticks", state.current_time);
    println!("\tExecuted {} tasks", state.executed_tasks_amount);
    println!("\tTotal waiting time: {} ticks", state.waiting_time);
    println!("\tAverage waiting time: {} ticks",
             state.waiting_time as f64 / state.executed_tasks_amount as f64);
}

struct State {
    tasks: Box<BTreeMap<i64, Vec<i64>>>,
    config: SimulationModeConfig,
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
            tasks,
            config,
        }
    }

    fn run(&mut self) {
        for (&spawn_at, tasks) in self.tasks.iter() {
            // skip unproductive waiting
            if self.current_time < spawn_at {
                self.current_time = spawn_at;
            }

            // add delay to the waiting time
            {
                let delay = self.current_time - spawn_at;
                if delay > 0 {
                    self.waiting_time += delay;
                }
            }

            // calculate current tasks execution time
            {
                let execution_time = tasks
                    .iter()
                    .fold(0, |acc, &cost| acc + cost)
                    + (self.config.process_boot_time + self.config.process_finish_time)
                    * tasks.len() as i64;

                self.current_time += execution_time;

                // remember that first task in this queue will be executed right away
                self.waiting_time += execution_time - *tasks.last().unwrap()
                    + (self.config.process_boot_time + self.config.process_finish_time)
                    * (tasks.len() as i64 - 1);
            }

            self.executed_tasks_amount += tasks.len() as i64;
        }
    }
}