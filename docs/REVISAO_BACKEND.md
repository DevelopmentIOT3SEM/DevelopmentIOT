# 🔎 Revisão do Backend (.NET 9 — PecaMonitoramentoAPI)

Revisão de leitura (nenhum arquivo alterado). Prioridades por impacto no fim.

> Nota: o schema do banco existe em `Codigo_SQL/tabelas.sql` (raiz do repo), e o
> `.gitignore` já foi adicionado na consolidação — desconsiderar essas duas
> observações do relatório original.

## Prioridades imediatas (maior impacto)
1. **`CreatedAtAction` quebra o registro** — `AuthController.cs:43` aponta para um POST → `InvalidOperationException` (500) mesmo no sucesso. Trocar por `Ok(result)`.
2. **Conexão inconsistente** — `Program.cs:18` registra `IDbConnection` Scoped usado só pelo `UsuarioRepository`, enquanto o resto usa `DapperContext.CreateConnection()`. Padronizar tudo no `DapperContext` com `using`.
3. **Segredos versionados** — chave JWT (`appsettings.json:13`) e senha do banco (`appsettings.json:3`) em texto plano no Git. Externalizar p/ env e **rotacionar a chave**.
4. **Endpoints públicos** — só `GET /api/Auth/me` tem `[Authorize]`. Qualquer um cria/deleta produção e monitoramento. Proteger `POST`/`DELETE`.
5. **Rampa errada** — `ProcessamentoController.cs:84-85` usa `rampa = idPeca` (assume ID 1/2). Mapear pelo tipo: `tipoDetectado == "Metálica" ? 1 : 2`. Extrair lógica p/ `ProcessamentoService` testável.

## Bugs / correção
- [ALTA] `CreatedAtAction` errado — `AuthController.cs:43`.
- [ALTA] `IDbConnection` Scoped reutilizado / não dispensado — `Program.cs:18`, `UsuarioRepository.cs:10-15`.
- [ALTA] Rampa derivada do `IdPeca` em vez do tipo — `ProcessamentoController.cs:84-85`.
- [MÉDIA] DTOs de auth sem validação (`LoginDTO`, `UsuarioDTO`) — senha vazia vira hash válido.
- [MÉDIA] `catch (Exception)` no registro mascara erro e vaza `ex.Message` — `AuthController.cs:45-48` / `AuthService.cs:36`.
- [MÉDIA] `GetMe` sem tratamento de falha de banco — `AuthController.cs:60`.
- [BAIXA] Comparação de estado case-sensitive (`"on"`) — `ProcessamentoController.cs:51-52`.
- [BAIXA] `RegistroDTO` é código morto (idêntico a `UsuarioDTO`).
- [BAIXA] `Create` retorna o DTO de entrada, não o recurso criado — `MonitoramentoController.cs:38`, `ProducaoController.cs:38`.

## Segurança
- [ALTA] Segredos hardcoded versionados (ver prioridade 3).
- [ALTA] Endpoints de escrita/DELETE públicos (ver prioridade 4).
- [ALTA] `Jwt:Secret` sem null-check — `Program.cs:32`, `AuthService.cs:58` → quebra se ausente. Validar no startup.
- [MÉDIA] Codificação divergente: gera token com `ASCII` (`AuthService.cs:58`), valida com `UTF8` (`Program.cs:32`). Unificar em UTF8.
- [MÉDIA] `SELECT *` traz `SenhaHash` sempre — `UsuarioRepository.cs:19,35`. Selecionar colunas explícitas.
- [MÉDIA] `BCrypt.Net-Core` (fork antiga) — migrar p/ `BCrypt.Net-Next`.
- [BAIXA] CORS fixo em `http://localhost:5500` — `Program.cs:65`. Tornar configurável.
- [BAIXA] Token de 7 dias, sem refresh/logout — `AuthService.cs:68`. Documentar.
- ✅ SQL injection: queries parametrizadas pelo Dapper — OK.

## Qualidade / boas práticas
- Sem middleware global de exceções (`UseExceptionHandler` + `ProblemDetails`).
- Services são repasses 1:1 sem lógica (boilerplate; ponto de extensão).
- Dois namespaces de DTO (`PecaMonitoramentoAPI.DTOs` e `...Models.DTO`). Unificar.
- Lógica de negócio dentro do `ProcessamentoController` — extrair p/ service.
- Nullability inconsistente (Models/DTOs com `string` não inicializada).
- `IUsuarioRepository` retorna `Task<Usuario>` mas pode ser null — usar `Usuario?`.
- Magic numbers/strings (IDs de sensor, `"Metálica"`/`"on"`...). Centralizar em constantes/enum.

## Falta para ficar "pronto"
- Testes (xUnit) — nenhum projeto de teste existe.
- Logging estruturado (`ILogger`/Serilog) — hoje nada loga.
- Health check (`/health`, `AddNpgSql`).
- Swagger com Bearer (`AddSecurityDefinition`) e XML comments.
- `.env.example` + connection string via env no `docker-compose`.
- Condicionar `UseHttpsRedirection()` ao ambiente (container só expõe HTTP).
- Montar `Codigo_SQL/tabelas.sql` como init no Postgres do compose.
