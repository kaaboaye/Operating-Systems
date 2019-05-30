<template>
  <div class="worker">
    <v-layout text-xs-center wrap>
      <v-flex xs12 mb-5 style="padding: 1em">
        <v-text-field
          v-model.number="workersAmount"
          label="Number of workers"
          type="number"
          required
        />
        <v-text-field
          v-model.number="tasksAmount"
          label="Number of tasks"
          type="number"
          required
        />

        <v-dialog v-model="workersDialog" width="500">
          <template v-slot:activator="{ on }">
            <v-btn color="primary lighten-2" dark v-on="on"
              >Configure workers</v-btn
            >
          </template>

          <v-card style="padding: 1em">
            <v-text-field
              v-for="worker in workers"
              :key="worker.id"
              :label="`#${worker.id}`"
              v-model.number="worker.speed"
              number
              required
              value="0"
            />
          </v-card>
        </v-dialog>

        <v-btn @click="generateWorkers">Generate workers</v-btn>

        <v-dialog v-model="tasksDialog" width="500">
          <template v-slot:activator="{ on }">
            <v-btn color="primary lighten-2" dark v-on="on"
              >Configure tasks</v-btn
            >
          </template>

          <v-card style="padding: 1em">
            <p>{{ tasks }}</p>
          </v-card>
        </v-dialog>

        <v-btn @click="generateTasks">Generate tasks</v-btn>

        <v-btn color="primary" @click="rand">rand</v-btn>
        <v-btn color="primary" @click="robin">robin</v-btn>
        <v-btn color="primary" @click="alg1">alg1</v-btn>
        <v-btn color="primary" @click="alg2">alg2</v-btn>
        <v-btn color="primary" @click="alg3">alg3</v-btn>
        Average load: {{ averageLoad }}%
      </v-flex>

      <v-flex xs12>
        <div class="text-xs-center">
          <Worker
            v-for="worker in workers"
            :key="worker.id"
            :worker="worker"
            :capacity="capacity"
          />
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Worker from "./Worker.vue";

function randomInt(x) {
  return Math.floor(Math.random() * x);
}

export default {
  components: { Worker },

  data() {
    return {
      workersAmount: 30,
      workersDialog: false,
      workers: [],
      tasksDialog: false,
      tasksAmount: 1000,
      tasks: [],
      lastUsedMethod: "rand"
    };
  },

  created() {
    this.generateWorkers(true);
    this.generateTasks(true);
    this[this.lastUsedMethod]();
  },

  watch: {
    workersAmount(workersAmount) {
      workersAmount = Number.parseInt(workersAmount) || 0;

      if (2 > workersAmount && workersAmount >= 500) return;
      this.generateWorkers();
    },

    tasksAmount() {
      this.generateTasks();
    }
  },

  computed: {
    capacity() {
      return Math.max.apply(Math, this.workers.map(w => w.load));
    },

    averageLoad() {
      const capacity = this.capacity;
      const load =
        (this.workers
          .map(w => w.load / capacity)
          .reduce((acc, l) => acc + l, 0) /
          this.workers.length) *
        100;

      return Math.round(load);
    }
  },

  methods: {
    generateWorkers(stopSimulation) {
      this.workers = new Array(this.workersAmount)
        .fill(null)
        .map((_, id) => ({ id, load: 0, speed: Math.random() / 2 + 0.5 }));

      if (stopSimulation !== true) this[this.lastUsedMethod]();
    },

    generateTasks(stopSimulation) {
      this.tasks = new Array(this.tasksAmount)
        .fill(null)
        .map(() => Math.floor(Math.random() * 3000));

      if (stopSimulation !== true) this[this.lastUsedMethod]();
    },

    resetWorkers() {
      this.workers.forEach(worker => (worker.load = 0));
    },

    rand() {
      this.resetWorkers();
      this.lastUsedMethod = "rand";

      this.tasks.forEach(task => {
        const worker = this.workers[randomInt(this.workers.length)];
        worker.load += task / worker.speed;
      });
    },

    robin() {
      this.resetWorkers();
      this.lastUsedMethod = "robin";

      let lastWorker = 0;

      this.tasks.forEach(task => {
        const worker = (() => {
          for (let i = 0; i < 0.1 * this.workersAmount + 1; i++) {
            const worker = this.workers[lastWorker];
            lastWorker = (lastWorker + 1) % this.workersAmount;
            if (worker.load < 0.95 * this.capacity) {
              return worker;
            }
          }
          const worker = this.workers[lastWorker];
          lastWorker = (lastWorker + 1) % this.workersAmount;
          return worker;
        })();

        worker.load += task / worker.speed;
      });
    },

    alg1() {
      this.resetWorkers();
      this.lastUsedMethod = "alg1";

      this.tasks.forEach(task => {
        const worker = (() => {
          for (let i = 0; i < 0.1 * this.workersAmount + 1; i++) {
            const worker = this.workers[randomInt(this.workers.length - 1) + 1];
            if (worker.load < 0.95 * this.capacity) {
              return worker;
            }
          }
          return this.workers[0];
        })();

        worker.load += task / worker.speed;
      });
    },

    alg2() {
      this.resetWorkers();
      this.lastUsedMethod = "alg2";

      this.tasks.forEach(task => {
        const worker = (() => {
          if (this.workers[0].load < 0.5 * this.capacity) {
            return this.workers[0];
          }

          for (let i = 0; i < 0.1 * this.workersAmount + 1; i++) {
            const worker = this.workers[randomInt(this.workers.length - 1) + 1];
            if (worker.load < 0.95 * this.capacity) {
              return worker;
            }
          }
          return this.workers[0];
        })();

        worker.load += task / worker.speed;
      });
    },

    alg3() {
      this.resetWorkers();
      this.lastUsedMethod = "alg3";

      this.tasks.forEach(task => {
        const worker = (() => {
          if (this.workers[0].load < 0.5 * this.capacity) {
            return this.workers[0];
          }

          for (let i = 0; i < 0.1 * this.workersAmount + 1; i++) {
            const worker = this.workers[randomInt(this.workers.length - 1) + 1];
            if (worker.load < 0.95 * this.capacity) {
              return worker;
            }
          }
          return this.workers[0];
        })();

        worker.load += task / worker.speed;
      });
    }
  }
};
</script>
