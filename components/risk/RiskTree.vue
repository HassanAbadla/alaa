<template>
    <v-treeview :items="items" activatable item-key="id" class="">
        <template v-slot:label="{ item }">
            <v-row no-gutters align="center" width="100" justify="space-between" class="flex-nowrap">
                {{ item.label }}
            </v-row>
        </template>
    </v-treeview>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
    name: "AuditTree",
    // components: {
    //   SubscriptionItem,
    //   PackageItem,
    //   RoundItem
    // },
    computed: {
        items() {
            return [

                {
                    label: 'Category 1',
                    children: [
                        {
                            label : 'Risk# 1 (Risk short)'
                        },
                        {
                            label : 'Risk# 1 (Risk short)'
                        },

                        {
                            label : 'Risk# 1 (Risk short)'
                        },
                    ]

                },
                {
                    label: 'Category 2',
                    children: [
                        {
                            label : 'Risk# 1 (Risk short)'
                        },
                        {
                            label : 'Risk# 1 (Risk short)'
                        },
                    ]

                },
                {
                    label: 'Category 3',
                  

                }
            ]
        }
    },
    mounted() {
    },
    methods: {
       
    }
}
</script>