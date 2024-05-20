/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { openai } from "@ai-sdk/openai";
import { StreamingTextResponse, streamText } from "ai";
import axios from "axios";
import { NextResponse } from "next/server";
import { JSDOM } from "jsdom";

export async function POST(req: Request) {
  const {
    prompt: term,
    origin,
    productCount,
  } = (await req.json()) as {
    prompt: string;
    origin: string;
    productCount: number;
  };

  if (!term || !origin || !productCount) {
    return NextResponse.json(
      { error: "required parameters not specified" },
      { status: 400 },
    );
  }

  const data = await getProductsInfo({
    searchTerm: term,
    baseUrl: origin ?? "https://www.amazon.com",
    productCount: productCount,
  });

  const systemPrompt = `You write brief seo optimized,knowledgeable,neutral, and clear (minimum 1500 words) product roundup based on given product information by user. Return the response in markdown. Format the markdown to use bullets,headings,links, images, and so on. Be creative with your result must write the following sections for every product.
- Headline: A catchy and informative headline that summarizes the roundup.
- Introduction: A brief overview of the product category and why it's important or relevant.
- What matter in this? (show some relative information about what matters about this product)

Product overviews: For each product:
- Title (show the product name here in a nicer way)
- image (show the image as banner, not in a list item)
- description (describe the product best way possible)
- About this item
- Features
- Average Customer Review
- Customers Say (optional)
- pros & cons

- Conclusion: Summarize the roundup and recommend a product based on different needs or budgets.
add a product link in the bottom
`;

  const prompt = `
TOPIC: ${term}

${data?.map((d, i) => {
  return `
----------------------------- [PRODUCT ${i + 1}] -----------------------------
product_link: ${d?.link}
product_image_url: ${d?.imageUrl}
product_description: ${d?.description}

NAME: ${d?.title}
    
ABOUT_THIS_ITEM:
${d?.aboutThisItem.map((abt) => {
  return `- ${abt}`;
})}

FEATURES:
${d?.features}

AVERAGE_CUSTOMER_REVIEW:
${d?.averageCustomerReview}
    
CUSTOMERS_SAY:
${d?.customersSaying}



`;
})}
`;

  const result = await streamText({
    model: openai("gpt-4-turbo-preview"),
    system: systemPrompt,
    prompt,
    maxTokens: 4096,
  });

  return new StreamingTextResponse(result.toAIStream());
}

async function getProductsInfo({
  searchTerm,
  baseUrl,
  productCount,
}: {
  searchTerm: string;
  baseUrl: string;
  productCount: number;
}) {
  const url = `${baseUrl}/s?k=${encodeURI(searchTerm)}`;

  const res = await fetch(url);
  if (!res.ok) {
    console.error("response not ok");
    return;
  }
  const html = await res.text();

  const dom = new JSDOM(html);
  const document = dom.window.document as Document;

  const productCardsElms = document.querySelectorAll(
    "a.a-link-normal.s-no-outline",
  ) as NodeListOf<HTMLAnchorElement>;

  const productLinks: string[] = [];

  productCardsElms.forEach((el) => {
    productLinks.push(`${baseUrl}${el.href}`);
  });

  const productData: Awaited<ReturnType<typeof getProductInfo>>[] = [];

  for (let i = 0; i < productCardsElms.length; i++) {
    if (productData.length === productCount) {
      break;
    }
    const link = productLinks[i];
    if (!link) {
      continue;
    }
    const data = await getProductInfo(link);

    if (data) {
      productData.push(data);
    }
  }

  return productData;
}

async function getProductInfo(link: string) {
  try {
    let imageUrl: string;
    let title: string;
    let description: string;
    const aboutThisItem: string[] = [];
    let customersSaying: string = "";

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data: html, request } = await axios.get(link);

    const dom = new JSDOM(html);
    const document = dom.window.document as Document;
    // get image url
    const imgEl = document.querySelector(
      "img#landingImage",
    ) as HTMLImageElement;
    if (!imgEl) throw new Error(`No image element found`);
    imageUrl = imgEl.src;

    // get title
    title = document.querySelector("#title")?.textContent ?? "";

    // get description
    description =
      document
        .querySelector("meta[name='description']")
        ?.getAttribute("content") ?? "";
    // get about this item
    const aboutThisItemUl = document.querySelector(
      "ul.a-unordered-list.a-vertical.a-spacing-mini",
    );
    aboutThisItemUl?.querySelectorAll("li>span").forEach((span) => {
      const text = span.textContent?.trim();
      if (text) {
        aboutThisItem.push(text);
      }
    });
    // get customers saying
    const customersSayingEl = document.querySelector(
      "#cr-product-insights-cards p.a-spacing-small > span",
    );
    if (customersSayingEl) {
      customersSaying = customersSayingEl.textContent ?? "";
    }
    // details section html
    const detailsSectionEL = document.querySelector("#centerCol");

    // average customer review
    const averageCustomerReviewUnSafeHtml = detailsSectionEL?.querySelector(
      "#averageCustomerReviews_feature_div",
    )?.innerHTML;
    const averageCustomerReview = extractTextFromHTML(
      removeWhitespace(
        removeAllAttributes(
          removeScriptAndStyleTags(averageCustomerReviewUnSafeHtml ?? ""),
        ),
      ),
    );

    // features
    const features = extractTextFromHTML(
      removeWhitespace(
        removeAllAttributes(
          removeScriptAndStyleTags(
            detailsSectionEL?.querySelector("#productOverview_feature_div")
              ?.innerHTML ?? "",
          ),
        ),
      ),
    );

    const data = {
      title,
      imageUrl,
      link,
      description,
      aboutThisItem,
      customersSaying,
      averageCustomerReview,
      features,
    };
    return data;
  } catch (error) {
    // console.error("~error", error);
    return null;
  }
}

function removeScriptAndStyleTags(htmlString: string) {
  return htmlString.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    "",
  );
}
function removeWhitespace(htmlString: string) {
  return htmlString.replace(/\s/g, "");
}
function removeAllAttributes(htmlString: string) {
  return htmlString.replace(/(<\w+)\b[^>]*>/g, function (match, p1) {
    return p1 + ">";
  });
}
function extractTextFromHTML(htmlString: string, replacer?: string) {
  return htmlString
    .replace(/<[^>]*>/g, replacer ?? " ")
    .replace(/&[^;]+;/g, "");
}
