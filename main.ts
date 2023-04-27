import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "Hello world!";
  })
  .get("/elections/:county", async (context) => {
    context.response.body = await (await fetch(`https://www.voterfocus.com/CampaignFinance/candidate_pr.php?c=`+context?.params?.county)).text();
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });