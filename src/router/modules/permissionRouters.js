import Layout from "@/views/layout/Layout";

// 权限管理
const permissionRouters = {
  path: "/permission",
  name: "permission-management",
  component: Layout,
  redirect: '/permission/administrator/list',
  alwaysShow: true,
  meta: { title: "权限管理", icon: "permission" },
  children: [
    {
      path: "administrator",
      name: "Administrator",
      component: () => import("@/views/permission/administrator"),
      meta: { title: "管理员列表" },
      redirect: '/permission/administrator/list',
      children: [
        {
          path: "list",
          name: "AdministratorList",
          component: () => import("@/views/permission/administrator/list"),
          meta: { title: "管理员列表", icon: "administrator", breadcrumb: false }
        }
      ]
    },
    {
      path: "roles",
      name: "Role",
      component: () => import("@/views/permission/roles"),
      meta: { title: "角色列表" },
      redirect: '/permission/roles/list',
      children: [
        {
          path: "list",
          name: "RoleList",
          component: () => import("@/views/permission/roles/list"),
          meta: { title: "角色列表", icon: "user_role", breadcrumb: false }
        },
        {
          path: "info",
          name: "roleDetail",
          hidden: true,
          component: () => import("@/views/permission/roles/roleDetail"),
          meta: { title: "角色信息", icon: "permission" }
        },
        {
          path: "save",
          name: "roleAdd",
          hidden: true,
          component: () => import("@/views/permission/roles/roleDetail"),
          meta: { title: "新增角色", icon: "permission" }
        },
        {
          path: "update",
          name: "roleEdit",
          hidden: true,
          component: () => import("@/views/permission/roles/roleDetail"),
          meta: { title: "编辑角色", icon: "permission" }
        }
      ]
    }
  ]
}

export default permissionRouters