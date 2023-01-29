# tcb local switch login

## 如何使用

1. 初始化, 填写账户, 只需要执行一次

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

1. 配置文件的 `alias` 可选, 用于命令行直接选择账户

    ```bash
    tcbl -a $alias
    # name 也可以
    tcbl -a $name
    ```

2. 配置文件可以使用 `json5` 添加注释

    ```plain
    mv ~/.config/.cloudbase/.accounts.json ~/.config/.cloudbase/.accounts.json5
    ```

3. `-o` 命令详解  
    - `tcbl -o xxx` 会使用 `xxx`命令打开配置文件, 如 `tcbl -o vim` 将会用 `vim` 打开配置文件  
    - `tcbl -o` 不添加参数下, 在 `json` 模式会使用默认编辑器打开  
    - `tcbl -o` 不添加参数下, 在 `json5` 模式 等同于 `-o code`, 即  

      ```bash
      code ~/.config/.cloudbase/.accounts.json5
      ```

4. `tcbl -h` 查看帮助文档  

## 开发

```bash
pnpm install

pnpm start
```

## 发版

```bash
pnpm deploy
```
