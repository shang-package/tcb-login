# tcb local switch login

## 如何使用

1. 初始化, 填写账户

    ```bash
    tcbl --init -o
    ```

1. 更新账户

    ```bash
    tcbl -o
    ```

1. 登录

    ```bash
    tcbl
    ```

## 配置文件说明

```json
[
  {
    "name": "名字",
    "alias": "别名, 可选, 使用场景: tcbl -a $alias",
    "secretId": "https://console.cloud.tencent.com/cam/capi",
    "secretKey": "https://console.cloud.tencent.com/cam/capi"
  },
  {
    "name": "",
    "alias": "",
    "secretId": "",
    "secretKey": ""
  }
]
```

## 备注

1. `alias` 可选, 用于命令行直接选择账户

    ```bash
    tcbl -a $alias
    # name 也可以
    tcbl -a $name
    ```

2. 可以使用 `json5` 添加注释

    ```plain
    mv ~/.config/.cloudbase/.accounts.json ~/.config/.cloudbase/.accounts.json5
    ```

    > `json` 模式 `-o` 命令会使用默认编辑器打开  
    > `json5` 模式 `-o` 命令会使用 `code ~/.config/.cloudbase/.accounts.json5`, 请确保存在 `code` 命令
