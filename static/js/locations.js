const Locations = {
    delimiters: ['[[', ']]'],
    props: ['public_regions', 'project_regions', 'location', 'parallel_runners', 'cpu', 'memory'],
    emits: ['update:location', 'update:parallel_runners', 'update:cpu', 'update:memory'],
    template: `
    <div class="section">
    <div class="row">
        <div class="col">
            <h7>Load configuration</h7>
            <p>
                <h13>Specify engine region and load profile. CPU Cores and Memory are distributed for each parallel
                    runner
                </h13>
            </p>
        </div>
    </div>
    <div class="d-flex py-4 pl-1">
        <div class="custom-input w-100-imp">
            <p class="custom-input_desc mb-1">Engine location</p>
            <select class="selectpicker bootstrap-select__b" data-style="btn" 
                :value="location"
                @change="location_ = $event.target.value"
            >
                <optgroup label="Public pool" v-if="public_regions_.length > 0">
                    <option v-for="item in public_regions_">[[ item ]]</option>
                </optgroup>
                <optgroup label="Project pool" v-if="project_regions_.length > 0">
                    <option v-for="item in project_regions_">[[ item ]]</option>
                </optgroup>
            </select>
        </div>
        
        <div class="custom-input ml-3">
            <p class="custom-input_desc mb-1">Runners</p>
            <input-stepper 
                :default-value="parallel_runners_"
                uniq_id="backend_parallel"
                @change="val => (parallel_runners_ = val)"
            ></input-stepper>
        </div>
        <div class="custom-input ml-3">
            <p class="custom-input_desc mb-1">CPU Cores</p>
            <input-stepper 
                :default-value="cpu_"
                uniq_id="backend_cpu"
                @change="val => (cpu_ = val)"
            ></input-stepper>
        </div>
        <div class="custom-input mx-3">
            <p class="custom-input_desc mb-1">Memory, Gb</p>
            <input-stepper 
                :default-value="memory_"
                uniq_id="backend_memory"
                @change="val => (memory_ = val)"
            ></input-stepper>
        </div>
    </div>
</div>
    `,
    data() {
        return {
            location_: 'default',
            parallel_runners_: 1,
            cpu_: 1,
            memory_: 4,
            public_regions_: [],
            project_regions_: [],
        }
    },
    mounted() {
        console.log('locations mounted', this.$props, this.$data)
        if (this.$props.location) this.location_ = this.$props.location
        if (this.$props.parallel_runners) this.parallel_runners_ = this.$props.parallel_runners
        if (this.$props.cpu) this.cpu_ = this.$props.cpu
        if (this.$props.memory) this.memory_ = this.$props.memory
        if (this.$props.public_regions) this.public_regions_ = this.$props.public_regions
        if (this.$props.project_regions) this.project_regions_ = this.$props.project_regions
        console.log('locations mounted end', this.$props, this.$data)
        $('.selectpicker').selectpicker('refresh')
    },
    watch: {
        location_(newValue) {
            this.$emit('update:location', newValue)
        },
        parallel_runners_(newValue) {
            this.$emit('update:parallel_runners', newValue)
        },
        cpu_(newValue) {
            this.$emit('update:cpu', newValue)
        },
        memory_(newValue) {
            this.$emit('update:memory', newValue)
        },

        public_regions_(newValue) {
            console.log('refreshing selectpickers')
            this.$nextTick(() => {
                $('.selectpicker').selectpicker('refresh')
                $('.selectpicker').selectpicker('render')
            })

        },
        project_regions_(newValue) {
            console.log('refreshing selectpickers')
            this.$nextTick(() => {
                $('.selectpicker').selectpicker('refresh')
                $('.selectpicker').selectpicker('render')
            })
        },
    },
    methods: {
        async fetch_locations() {
            console.log('fetching locations')
            const resp = await fetch(`/api/v1/shared/locations/${getSelectedProjectId()}`)
            if (resp.ok) {
                const {public_regions, project_regions} = await resp.json()
                this.public_regions_ = public_regions
                this.project_regions_ = project_regions
            } else {
                console.warn('Couldn\'t fetch locations. Resp code: ', resp.status)
            }

        }
    }
}

register_component('Locations', Locations)