// plugins/toast.js
export default ({ app, store }, inject) => {
  inject("toast", {
    showMessage(data) {
      let content = data.message ? data.message : "notification"
      let color = "info"
      if (data.status == "success") color = "green"
      if (data.status == "error") color = "error"
      store.commit("alert/showMessage", { content, color })
    },
    showError(contentMessage) {
      let content = contentMessage ? contentMessage : "we have some problems,our technical team working on it"
      let color = "warning"
      store.commit("alert/showMessage", { content, color })
    }
  })
}
