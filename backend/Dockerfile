FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY PwcPruebaTecnica/PwcPruebaTecnica/PwcPruebaTecnica.csproj PwcPruebaTecnica/PwcPruebaTecnica/
RUN dotnet restore PwcPruebaTecnica/PwcPruebaTecnica/PwcPruebaTecnica.csproj

COPY . .
RUN dotnet publish PwcPruebaTecnica/PwcPruebaTecnica/PwcPruebaTecnica.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "PwcPruebaTecnica.dll"]
