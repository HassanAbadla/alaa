export function constructTreeView(data) {
  const processItem = (item, parentId = null) => {
    let icon = ""

    switch (item.link) {
      case "portfolio":
        icon = "mdi-briefcase-outline"
        break
      case "program":
        icon = "mdi-folder-outline"
        break
      case "project":
        icon = "mdi-file-document-outline"
        break
      case "contract":
        icon = "mdi-file-certificate-outline"
        break
      default:
        icon = ""
    }

    const treeItem = {
      id: item.id,
      name: item.name ? `${item.name}` : `${item.link}`,
      type: item.link,
      icon: icon,
      children: [],
      parentId: parentId
    }

    if (item.projects && item.link === "program") {
      treeItem.children = item.projects.map((project) => processItem(project, item.id))
    } else if (item.contracts && item.link === "project") {
      treeItem.children = item.contracts.map((contract) => processItem(contract, item.id))
    } else if (item.programs && item.link === "portfolio") {
      treeItem.children = item.programs.map((program) => processItem(program, item.id))
    }

    return treeItem
  }

  return data.map((item) => processItem(item))
}
