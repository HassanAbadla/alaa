import Vue from "vue"
import CustomInput from "@/components/custom-form/CustomInput.vue"
import CustomTextArea from "@/components/custom-form/CustomTextArea.vue"
import CustomCheckbox from "@/components/custom-form/CustomCheckbox.vue"
import CustomRadio from "@/components/custom-form/CustomRadio.vue"
import CustomDropdown from "@/components/custom-form/CustomDropdown.vue"
import FormWrapper from "@/components/custom-form/FormWrapper.vue"
import CustomDatePicker from "@/components/custom-form/CustomDatePicker.vue"
import CustomColorPicker from "../components/custom-form/CustomColorPicker.vue"

Vue.component("CustomInput", CustomInput)
Vue.component("CustomTextArea", CustomTextArea)
Vue.component("CustomRadio", CustomRadio)
Vue.component("CustomCheckbox", CustomCheckbox)
Vue.component("CustomDropdown", CustomDropdown)
Vue.component("custom-select", CustomDropdown) // Alias for backward compatibility
Vue.component("CustomDatePicker", CustomDatePicker)
Vue.component("FormWrapper", FormWrapper)
Vue.component("CustomColorPicker", CustomColorPicker)
