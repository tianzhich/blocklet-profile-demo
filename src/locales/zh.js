import { flatten } from 'flat';

export default flatten({
  userName: '用户名',
  email: '邮箱',
  phone: '手机',
  create: '创建',
  edit: '编辑',
  save: '保存',
  cancel: '取消',
  storageUnavailable:
    '您当前浏览器不支持本地存储，或者存储达到上限，您保存的信息将不会被存储。请尝试切换到最新版本的浏览器（Chrome、Firefox 或 Safari 等等）',
  profile: '个人信息',
  userNameHelpText: '用户名应以字母开头，长度为 5 到 15 个字符，只能包含字母、数字和下划线。',
  invalid: '不合法的',
  requiredHelpText: '此项为必填项',
});
