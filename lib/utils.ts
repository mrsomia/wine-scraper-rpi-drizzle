import axios from "axios";
import * as cheerio from "cheerio";

export async function getHTML(url:string) {
  const {data} = await axios.get(url)
  return data
}

export async function getTescoPrice(url:string) {
  const data = await getHTML(url)
  const $ = cheerio.load(data)
  const price = $(".price-per-sellable-unit .value")
  return price.text()
}

export async function getDunnesPrice(url:string) {
  const data = await getHTML(url)
  const $ = cheerio.load(data)
  const price = $("[itemprop=price]")[0].attribs.content
  return price.slice(1)
}
 
