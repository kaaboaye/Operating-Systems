use std::collections::{BinaryHeap, BTreeMap};

use tasks::{get_tasks, Task};

pub fn start() {
    println!("Starting Shortest Job First simulation");

    let tasks = get_tasks();

    let mut state = State::new(tasks);
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
    queue: BinaryHeap<Task>,
    current_time: i64,
    waiting_time: i64,
    executed_tasks_amount: i64,
}

impl State {
    fn new(tasks: Box<BTreeMap<i64, Vec<i64>>>) -> State {
        State {
            current_time: 0,
            waiting_time: 0,
            executed_tasks_amount: 0,
            queue: BinaryHeap::new(),
            tasks,
        }
    }

    fn run(&mut self) {
        for (&spawn_at, costs) in self.tasks.iter() {
            // evaluate tasks in the queue until new tasks appear
            while self.current_time < spawn_at {
                match self.queue.pop() {
                    None => break,
                    Some(task) => {
                        let delay = self.current_time - task.spawn_at;
                        println!("Evaluating task scheduled for {} at {} that will take {} ticks \
                                    with {} delay",
                                 task.spawn_at,
                                 self.current_time,
                                 task.cost,
                                 delay);
                        if delay > 0 { self.waiting_time += delay }

                        self.current_time += task.cost;
                        self.executed_tasks_amount += 1;
                    }
                }
            }

            // skip unproductive waiting
            if self.current_time < spawn_at {
                self.current_time = spawn_at;
            }

            // add new processes to the execution queue
            for &cost in costs {
                self.queue.push(Task { spawn_at, cost })
            }
        };

        loop {
            match self.queue.pop() {
                None => break,
                Some(task) => {
                    let delay = self.current_time - task.spawn_at;
                    println!("Evaluating task scheduled for {} at {} that will take {} ticks \
                                    with {} delay",
                             task.spawn_at,
                             self.current_time,
                             task.cost,
                             delay);
                    if delay > 0 { self.waiting_time += delay }

                    self.current_time += task.cost;
                    self.executed_tasks_amount += 1;
                }
            }
        }
    }
}
