use std::env;
use config::simulation_config::SimulationConfig;

mod config;
mod tasks;
mod fifo;
mod sjf;
mod rr;

fn main() {
    let args: Vec<String> = env::args().collect();

    let config = SimulationConfig::new();

    match args.get(1) {
        Some(x) if x == "fifo" => fifo::start(config.fifo),
        Some(x) if x == "sjf" => sjf::start(config.sjf),
        Some(x) if x == "rr" => rr::start(config.rr),
        Some(x) if x == "all" => {
            fifo::start(config.fifo);
            sjf::start(config.sjf);
            rr::start(config.rr);
        }
        _ => help(),
    }
}

fn help() {
    println!("Provided bed arguments\n\
  \tcmd MODE\n\
  \n\
  Where MODE in [fifo, sjf, rot]");
}