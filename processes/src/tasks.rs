use std::cmp::Ordering;
use std::collections::BTreeMap;
use std::fs;
use std::process::exit;

use config::simulation_mode_config::SimulationModeConfig;

pub fn get_tasks(ref config: &SimulationModeConfig) -> Box<BTreeMap<i64, Vec<i64>>> {
    let mut tree: Box<BTreeMap<i64, Vec<i64>>> = Box::new(BTreeMap::new());

    println!("Reading tasks");

    fs::read_to_string("tasks.csv")
        .expect("Something went wrong reading the file")
        .split("\n")
        .for_each(|line| {
            if line == "" { return; }

            let nums: Vec<i64> = line
                .split(',')
                .map(|n| match n.parse() {
                    Ok(x) => x,
                    _ => {
                        println!("TASKS field to parse integer '{}'", n);
                        exit(1);
                    }
                })
                .collect();

            match &nums[..] {
                [at, cost] => tree
                    .entry(*at)
                    .or_insert_with(Vec::new)
                    .push(*cost),

                _ => {
                    println!("TASKS HAVE BAD FORMAT");
                    exit(1);
                }
            };
        });

    if config.debug {
        for (at, costs) in tree.iter() {
            let s_costs: Vec<String> = costs.iter().map(|x| x.to_string()).collect();
            println!("Task spawn at: {}, cost: {}", at, s_costs.as_slice().join(", "));
        }
    }

    println!("END OF TASKS");

    tree
}



#[derive(Clone, Eq)]
pub struct RunningTask {
    pub spawn_at: i64,
    pub cost: i64,
    pub initial_cost: i64,
}

impl Ord for RunningTask {
    fn cmp(&self, other: &RunningTask) -> Ordering {
        self.cost.cmp(&-other.cost)
    }
}

impl PartialOrd for RunningTask {
    fn partial_cmp(&self, other: &RunningTask) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl PartialEq for RunningTask {
    fn eq(&self, other: &RunningTask) -> bool {
        self.cost == other.cost
    }
}

#[derive(Eq)]
pub struct Task {
    pub spawn_at: i64,
    pub cost: i64,
}

impl Ord for Task {
    fn cmp(&self, other: &Task) -> Ordering {
        self.cost.cmp(&-other.cost)
    }
}

impl PartialOrd for Task {
    fn partial_cmp(&self, other: &Task) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl PartialEq for Task {
    fn eq(&self, other: &Task) -> bool {
        self.cost == other.cost
    }
}