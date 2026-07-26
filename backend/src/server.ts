import app from "./app";
import prisma from "./config/prisma";

const PORT = Number(process.env.PORT) || 3000;

async function startServer(){

  try{

    await prisma.$connect();

    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch(err){
    console.error(err);
  }
}

startServer();


