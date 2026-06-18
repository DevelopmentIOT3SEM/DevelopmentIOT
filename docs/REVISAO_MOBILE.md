# 🔎 Revisão do Mobile (Expo Router / React Native / TypeScript)

Expo SDK 53, RN 0.79, React 19, TS 5.8. Revisão de leitura (nada alterado).

## 🚨 Bloqueadores (app não compila/roda confiável)
1. **Import inexistente `../prisma/client`** quebra o build TS — `app/(tabs)/index.tsx:11`, `components/dashboard/TrendingCard.tsx:5`. Mover a interface `ProductionItem` (já em `AuthContext.tsx:6-11`) para `types/production.ts`. Remover qualquer vestígio de Prisma.
2. **`useAuth()` chamado no topo do módulo** (fora de componente) — `app/(tabs)/_layout.tsx:11`. "Invalid hook call". Apagar a linha (já há a versão correta na linha 16).
3. **`<AuthProvider>` aninhado/duplicado** — `app/(auth)/_layout.tsx:6` cria um 2º provider, inconsistência de `isAuthenticated`. Remover (manter só o do layout raiz).
4. **URLs hardcoded + HTTP** — API em `http://52.44.49.80:5271` (`AuthContext.tsx:23`) e chatbot em `http://192.168.66.11:500/chat` (`chatbot.tsx:46`, IP de LAN, porta inválida). RN bloqueia cleartext por padrão. Externalizar p/ `EXPO_PUBLIC_API_URL` e usar HTTPS.

## Bugs
- [MÉDIA] `api.js` e `authService.js` são **código morto / scripts de teste** (credenciais fixas, sem export válido, endpoints desatualizados). Deletar ou transformar em instância axios real.
- [MÉDIA] `useFrameworkReady` usa `window` (não existe no nativo) e roda em todo render — boilerplate de template, remover.
- [MÉDIA] Seletor de período (`charts.tsx`) só tem "Semana"; dados nunca filtrados por tempo.
- [BAIXA] Logout sem `router.replace` explícito.
- [BAIXA] `console.log` de senha e token — `AuthContext.tsx:77,84`.
- [BAIXA] Fórmulas de "Total Produzido"/refugo confusas — `index.tsx:60,114`.
- [BAIXA] Contraste de inputs quase ilegível (cinza sobre cinza) — LoginForm/RegisterForm.

## Segurança
- [ALTA] JWT em `AsyncStorage` (não criptografado) — usar `expo-secure-store`. `jwt-decode` está instalado mas nunca usado (sem checar expiração).
- [ALTA] Comunicação em HTTP puro.
- [MÉDIA] Log de credenciais/token no console.
- [MÉDIA] Sem tratamento global de 401 / expiração de sessão.
- ✅ Sem segredos versionados; `.gitignore` cobre `.env`/chaves.

## Qualidade
- Mistura `.js` + `.tsx`; tipagem fraca (`useState<any[]>` em charts).
- Camada de API não centralizada (axios global, fetches dentro do AuthContext). Extrair p/ `lib/api.ts` com interceptor.
- Fetch duplicado entre `index.tsx` e `ActivityCard`.
- Deps problemáticas: `@types/react-native` (conflita c/ RN 0.79), `expo-camera`/`react-native-url-polyfill` não usados, `.npmrc` com `legacy-peer-deps`.
- Resíduos de template: `app.json` name/slug `expo-nativewind`, refs a NativeWind inexistente, `package.json` name `expo-starter`.
- Scripts `package.json` em sintaxe Unix (não rodam no PowerShell) — usar `cross-env`.

## Falta p/ "pronto"
Config de ambiente (`app.config.ts` + `.env.example`), camada de API centralizada, secure-store + expiração de token, limpeza de código morto/template, README de verdade (hoje 3 linhas), `eas.json`/build, `tsc --noEmit` passando limpo.
