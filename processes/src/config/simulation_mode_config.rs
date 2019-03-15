#[derive(Clone)]
pub struct SimulationModeConfig {
    pub process_boot_time: i64,
    pub process_finish_time: i64,
    pub process_interruption_time: i64,
    pub robin_time_window: i64,
    pub processor_frequency: i64,
    pub debug: bool,
}