use std::collections::{BinaryHeap, BTreeMap};

use config::simulation_mode_config::SimulationModeConfig;
use tasks::{get_tasks, RunningTask};

pub fn start(config: SimulationModeConfig) {
    println!("👀 Starting Preemptive Shortest Job First simulation");

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
    queue: BinaryHeap<RunningTask>,
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
            queue: BinaryHeap::new(),
            tasks,
            config,
        }
    }

    fn run(&mut self) {
        for (&spawn_at, costs) in self.tasks.iter() {
            // evaluate tasks in the queue until new tasks appear
            while self.current_time < spawn_at {
                match self.queue.peek_mut() {
                    None => break,
                    Some(mut task) => {
                        if task.cost + self.current_time >= spawn_at {
                            task.cost -= spawn_at - self.current_time;
                            break;
                        };

                        let delay = self.current_time - task.spawn_at;
                        if self.config.debug {
                            println!("Evaluating task scheduled for {} at {} that will take {}\
                                    ticks with {} delay",
                                     task.spawn_at,
                                     self.current_time,
                                     task.cost,
                                     delay);
                        }

                        if delay > 0 { self.waiting_time += delay }

                        self.current_time += self.config.process_boot_time +
                            task.cost +
                            self.config.process_finish_time;

                        self.executed_tasks_amount += 1;
                    }
                }

                self.queue.pop();
            }

            // skip unproductive waiting
            if self.current_time < spawn_at {
                self.current_time = spawn_at;
            }

            // add new processes to the execution queue
            for &cost in costs {
                self.queue.push(RunningTask { spawn_at, cost, initial_cost: cost })
            }
        };

        loop {
            match self.queue.pop() {
                None => break,
                Some(task) => {
                    let delay = self.current_time - task.spawn_at;

                    if self.config.debug {
                        println!("Evaluating task scheduled for {} at {} that will take {} ticks \
                                    with {} delay",
                                 task.spawn_at,
                                 self.current_time,
                                 task.cost,
                                 delay);
                    }

                    if delay > 0 { self.waiting_time += delay }

                    self.current_time += self.config.process_boot_time +
                        task.cost +
                        self.config.process_finish_time;

                    self.executed_tasks_amount += 1;
                }
            }
        }
    }
}
