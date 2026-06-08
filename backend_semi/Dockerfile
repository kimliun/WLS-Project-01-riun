# ---------------------------------------------------------
# 1단계: 빌드 스테이지 (이름: build)
# ---------------------------------------------------------
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# 프로젝트 파일들 복사
COPY .mvn .mvn
COPY mvnw mvnw.cmd pom.xml ./
COPY src src

# 빌드 실행 (.jar 파일이 target 폴더에 생성됨)
RUN ./mvnw clean package -DskipTests

# ---------------------------------------------------------
# 2단계: 실행 스테이지 (최종적으로 남는 이미지)
# ---------------------------------------------------------
FROM eclipse-temurin:21-jre
WORKDIR /app

# 1단계(build)에서 생성된 jar 파일만 쏙 가져옴
COPY --from=build /app/target/*.jar app.jar

# 필요한 설정 (포트, 폴더 생성 등)
RUN mkdir -p /app/images
EXPOSE 9000

# 최종 실행 명령어
ENTRYPOINT ["java", "-jar", "app.jar"]