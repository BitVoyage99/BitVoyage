# BitVoyage99

비트코인 거래량 차트 렌더링의 여정


## Demo 
<a href="http://bit-voyage-env.eba-93pip9c5.ap-northeast-2.elasticbeanstalk.com/">AWS링크</a>

## 프로젝트 소개
 * 비트코인 거래량 차트 렌더링의 여정

⭐ Upit 웹소켓 실제 거래 데이터를 통해 많은 데이터 수신시 프론트엔드의 뷰를 최적화하는 방법 학습

React와 TypeScript로 개발된 실시간 암호화폐 거래 정보 웹 애플리케이션.
Upbit API 활용하여실시간 시세 정보와 호가 정보를 제공하며, WebSocket을 통해 데이터를 실시간으로 업데이트.

## 주요 기능 소개

1️⃣ WebSocket API 통합 및 관리
WebSocket을 사용하여 실시간 코인 데이터 수신.
네트워크 자원 효율화

2️⃣ 특정 코인(Market code) 선택
zustand를 사용한 전역 상태 관리
사용자가 선택한 코인에 대한 상세 정보 제공

3️⃣ 실시간 시세 정보 / 호가 / 차트 표시 기능
선택된 코인에 대한 실시간 가격 차트 표시
전일 대비 가격 변동을 시각적으로 표현
다양한 차트 유형과 시간 단위 옵션 제공
호가 차트를 통해 매수/매도 잔량을 시각화

#### 호가 차트
<img width="233" alt="호가차트" src="https://github.com/BitVoyage99/BitVoyage/assets/18062098/e4a34618-18b1-415f-be8f-813b4e4efc3c">

#### 코인 거래량 차트
<img width="380" alt="코인 거래량 차트" src="https://github.com/BitVoyage99/BitVoyage/assets/18062098/18a45890-f803-443d-84fc-d997f10ff667">

#### 현재가 차트
<img width="565" alt="현재가 차트" src="https://github.com/BitVoyage99/BitVoyage/assets/18062098/9854bacf-5dbe-4968-8655-c4ef97900329">


## 개발 기간
* 2024.04.22 ~ 2024.05.18

#### 기술 Stack 및 개발환경

# Environment 
vscode

# Config
npm, axios, AWS elasticbeanstalk

# Development
Javascript, typescript, reat, vite,  

# Communication
Slack, Notion, Zep

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

# npm install settings
npm install axios
npm install --save lightweight-charts
npm install antd shadcn/ui
import 'antd/dist/antd.css';
