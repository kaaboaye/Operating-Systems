use std::cmp::Ordering;
use std::collections::BTreeMap;
use std::fs;
use std::process::exit;

pub fn get_tasks() -> Box<BTreeMap<i64, Vec<i64>>> {
    let mut tree: Box<BTreeMap<i64, Vec<i64>>> = Box::new(BTreeMap::new());

    println!("Reading tasks");

    fs::read_to_string("tasks.csv")
        .expect("Something went wrong reading the file")
        .split("\n")
        .for_each(|line| {
            let nums: Vec<i64> = line
                .split(',')
                .map(|n| match n.parse() {
                    Ok(x) => x,
                    _ => {
                        println!("TASKS HAVE BAD FORMAT");
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


    for (at, costs) in tree.iter() {
        let s_costs: Vec<String> = costs.iter().map(|x| x.to_string()).collect();
        println!("Task spawn at: {}, cost: {}", at, s_costs.as_slice().join(", "));
    }

    println!("END OF TASKS");

    tree
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