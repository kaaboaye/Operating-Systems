use std::env;

mod tasks;

mod fifo;
mod sjf;
mod rot;

fn main() {
    let args: Vec<String> = env::args().collect();

    // let options = &args[2..];

    match args.get(1) {
        Some(x) if x == "fifo" => fifo::start(),
        Some(x) if x == "sjf" => sjf::start(),
        Some(x) if x == "rot" => rot::start(),
        _ => help(),
    }
}

fn help() {
    println!("Provided bed arguments\n\
  \tcmd MODE\n\
  \n\
  Where MODE in [fifo, sjf, rot]");
}