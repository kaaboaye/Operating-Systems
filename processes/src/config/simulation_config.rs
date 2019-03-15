use config::simulation_mode_config::SimulationModeConfig;

pub struct SimulationConfig {
    pub fifo: SimulationModeConfig,
    pub sjf: SimulationModeConfig,
    pub rr: SimulationModeConfig,
}

impl SimulationConfig {
    pub fn new() -> SimulationConfig {
        let mode_conf = SimulationModeConfig {
            process_boot_time: 3,
            process_finish_time: 2,
            process_interruption_time: 30,
            robin_time_window: 1000,
            processor_frequency: 3_000_000_000, // 3GHz
            debug: false,
        };

        SimulationConfig {
            fifo: mode_conf.clone(),
            sjf: mode_conf.clone(),
            rr: mode_conf,
        }
    }
}