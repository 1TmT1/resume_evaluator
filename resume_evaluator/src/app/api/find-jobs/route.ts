import { NextRequest, NextResponse } from "next/server";
import * as cheerio from 'cheerio';

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.searchParams);
        const location = searchParams.get("location");
        const job = searchParams.get("job");
        
        if (job && location) {
            const res = await fetch(`https://www.linkedin.com/jobs/search?keywords=${job}&location=${location}`);
            const text = await res.text();
            const $ = cheerio.load(text);
            const linkItems = $('.jobs-search__results-list li div');

            const jobs: string[][] = [];

            linkItems.each((index, element) => {
                const titleElement = $(element).find('.base-search-card__title');
                const companyElement = $(element).find('.base-search-card__subtitle');
                const locationElement = $(element).find('.job-search-card__location');
                const link = $(element).find('a').attr()?.href;

                const title = titleElement.text().replaceAll("\n", "").trim();
                const company = companyElement.text().replaceAll("\n", "").trim();
                const location = locationElement.text().replaceAll("\n", "").trim();
                if (link?.includes('position') && !title.includes('*') && !company.includes('*') && !location.includes('*')) {
                    let actualLink = '';
                    for (let i = 0; i < link.length; i++) {
                        if (link[i] === '?') break;
                        actualLink += link[i];
                    }
                    jobs.push([actualLink, title, company, location]);
                }
            });

            return NextResponse.json({ message: jobs }, { status: 200 })
        } else {
            return NextResponse.error();
        }
    } catch {
        return NextResponse.error();
    }
}