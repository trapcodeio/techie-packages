<template>
    <div id="app">
        <div class="container">
            <h3 class="is-size-3 has-text-centered">Choose a Package</h3>
            <div v-if="loaded" class="columns mt-5">
                <template v-for="(p, packageIndex) in packages">
                    <div :key="packageIndex" class="column">
                        <div class="box has-text-centered shadow-sm">
                            <h4 class="is-size-4 has-text-weight-bold">{{p.name}}</h4>

                            <!-- List subpackages -->
                            <div v-if="p.subpackages && p.subpackages.length" class="mt-5">
                                <template v-for="(sub, subIndex) in p.subpackages">
                                    <div :key="subIndex" class="my-2">
                                        <label class="checkbox">
                                            <input type="checkbox" checked="true"
                                                   @change="subPackageChanged(packageIndex, subIndex)">
                                            {{sub.name}}
                                        </label>
                                    </div>
                                </template>
                            </div>

                            <h5 class="is-size-5 mt-5">{{(packagesData[p.id].amount).toLocaleString()}}/month</h5>

                            <div class="mt-5">
                                <button @click="subscribeTo(packageIndex)" class="button is-info">Subscribe</button>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <!-- A simple view to see the data am working with -->
            <pre class="box shadow-none my-3">{{onePackageSample}}</pre>
        </div>
    </div>
</template>

<script>
    import packages from "./packages.js"

    export default {
        name: 'Packages',

        data() {
            return {
                packages,
                // Hold needed packages data
                packagesData: {},

                loaded: false
            }
        },

        computed: {
            onePackageSample() {
                return JSON.stringify(this.packages[0], null, 2)
            }
        },

        mounted() {
            // On mounted populate 'packagesData'
            // amount will be modified once any sub package is ticked or unticked
            // unticked_sub_packages will hold id of sub packages unticked.
            for (const p of packages) {
                // To enable reactivity we use this.$set
                this.$set(this.packagesData, p.id, {
                    amount: Number(p.mon_amount),
                    unticked_sub_packages: []
                });
            }

            // Set loaded to true
            this.loaded = true;
        },

        methods: {
            subPackageChanged(packageIndex, subIndex) {
                // Package of subpackage ticked/unticked
                const plan = this.packages[packageIndex];
                // Exact subpackage ticked/unticked
                const sub = plan.subpackages[subIndex];
                // Package Data
                const planData = this.packagesData[plan.id];

                /**
                 * If sub.id is already in unticked sub packages we remove it else we add it
                 */
                if (planData.unticked_sub_packages.includes(sub.id)) {
                    planData.unticked_sub_packages = planData.unticked_sub_packages.filter((id) => id !== sub.id);
                } else {
                    planData.unticked_sub_packages.push(sub.id)
                }


                // Determine the amount for this package
                if (planData.unticked_sub_packages.length) {
                    // Calculate prices of ticked sub packages
                    // Filter by removing ids of unticked sub packages
                    let tickedPackages = plan.subpackages.filter((subPackage) => {
                        return !planData.unticked_sub_packages.includes(subPackage.id)
                    })

                    let tickedPackagesTotal = 0;

                    // Sum monthly amount of ticked packages
                    for (const tickedPackage of tickedPackages) {
                        tickedPackagesTotal = tickedPackagesTotal + Number(tickedPackage.mon_amount)
                    }

                    // Set total amount of ticked packages to 'amount_shown'
                    planData.amount = tickedPackagesTotal;
                } else {
                    planData.amount = Number(plan.mon_amount);
                }
            },

            subscribeTo(packageIndex) {
                const plan = this.packages[packageIndex];
                const planData = this.packagesData[plan.id];

                alert(`
                    Subscribed to: ${plan.name},
                    Amount: ${planData.amount}
                    Unticked Sub Packages Id: ${planData.unticked_sub_packages}
                `)
            }
        }
    }
</script>


<style>
    #app {
        margin-top: 100px;
    }
</style>
