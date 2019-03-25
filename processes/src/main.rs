use std::{env, io};

use config::simulation_config::SimulationConfig;
use config::simulation_mode_config::SimulationModeConfig;

mod config;
mod tasks;
mod fifo;
mod sjf;
mod psjf;
mod rr;

fn main() {
    let args: Vec<String> = env::args().collect();

    let config = SimulationConfig{
        fifo: SimulationModeConfig {
            process_boot_time: 4,
            process_finish_time: 4,
            process_interruption_time: 0,
            robin_time_window: 0,
            debug: false,
        },
        sjf: SimulationModeConfig {
            process_boot_time: 8,
            process_finish_time: 8,
            process_interruption_time: 4,
            robin_time_window: 400,
            debug: false,
        },
        rr: SimulationModeConfig {
            process_boot_time: 6,
            process_finish_time: 6,
            process_interruption_time: 4,
            robin_time_window: 400,
            debug: false,
        }
    };

    let cmd = if let Some(cmd) = args.get(1) {
        Box::new(cmd.to_string())
    } else {
        let mut line = String::new();
        println!("Provide mode");
        io::stdin().read_line(&mut line).unwrap();
        Box::new(line.trim().to_string())
    };

    match cmd.as_ref() {
        x if x == "fifo" => fifo::start(config.fifo),
        x if x == "sjf" => sjf::start(config.sjf),
        x if x == "psjf" => psjf::start(config.sjf),
        x if x == "rr" => rr::start(config.rr),
        x if x == "all" => {
            fifo::start(config.fifo);
            sjf::start(config.sjf.clone());
            psjf::start(config.sjf);
            rr::start(config.rr);
        }
        x => help(x),
    }
}

fn help(s: &String) {
    println!("Provided bed arguments\n\
  \tGot: {}\n\
  \tcmd MODE\n\
  \n\
  Where MODE in [fifo, sjf, psjf, rr, all]", s);
}