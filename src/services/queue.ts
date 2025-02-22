import Queue, { Job } from "bull";

interface JobData {
    mensagem: string;
}

// Criar a fila 'minhaFila' conectada ao Redis
const queue = new Queue<JobData>("minhaFila", {
    redis: {
        host: "127.0.0.1",
        port: 6379
    }
});

// Tratamento de erros
queue.on("failed", (job, err) => {
    console.error(`Job ${job.id} falhou: ${err.message}`);
});

queue.on("completed", (job) => {
    console.log(`Job ${job.id} concluído com sucesso`);
});

export default queue;
