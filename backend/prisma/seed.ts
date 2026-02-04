import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.todo.createMany({
    data: [
      {
        title: 'Học Docker cơ bản',
        description: 'Tìm hiểu về Dockerfile, docker-compose, volumes, networks',
        completed: true
      },
      {
        title: 'Build Todo App',
        description: 'Tạo ứng dụng CRUD với Docker',
        completed: true
      },
      {
        title: 'Deploy lên production',
        description: 'Sử dụng Docker Swarm hoặc Kubernetes',
        completed: false
      },
      {
        title: 'CI/CD với Docker',
        description: 'Tích hợp GitHub Actions với Docker',
        completed: false
      }
    ]
  });

  console.log('Seeded database successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
