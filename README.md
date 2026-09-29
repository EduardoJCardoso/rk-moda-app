# RK Moda Feminina — Expo

Versão mobile do projeto, preparada para Expo Go, com:
- ícones Material Design via `@expo/vector-icons`;
- modo claro e escuro;
- dados locais/mockados para funcionar sem backend;
- Supabase mantido como integração opcional.

## Rodar

```bash
npm install
npx expo start -c
```

Para celular na mesma Wi-Fi, escaneie o QR Code pelo Expo Go.

Se houver problema de rede, tente:

```bash
npx expo start --tunnel
```

## Dependências

O projeto foi limpo das dependências Vite/Web que estavam causando conflito de `peerDependencies`. O Expo SDK 57 usa React Native 0.86 e React 19.2.3.
