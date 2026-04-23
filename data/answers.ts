import { ALL_CONVERSION_PAIRS, type ConversionPair } from "@/data/conversions"

export interface AnswerExample {
  /** Human-readable scenario, e.g., "You have a 4 GB video file". */
  scenario: string
  /** The raw math, e.g., "4 GB * 1,024 = 4,096 MB". */
  calculation: string
  /** One-line takeaway the reader walks away with. */
  takeaway: string
}

export interface AnswerFAQ {
  question: string
  answer: string
}

export interface Answer {
  /** URL slug, e.g., "how-many-mb-in-a-gb". */
  slug: string
  /** User-facing question, used for H1 and title. */
  question: string
  /** Meta description, max ~155 chars. */
  metaDescription: string
  /** Target search keywords. */
  keywords: string[]
  /** 2026 estimated monthly search volume for the primary query (optional). */
  searchVolumeEstimate?: number
  /**
   * The underlying conversion pair slug from data/conversions.ts
   * (e.g., "gb-to-mb"). Used to look up units and auto-compute the
   * numeric answer plus the reference table.
   */
  conversionPairSlug: string
  /**
   * The "how many X in Y" question is interpreted as: 1 of toUnit
   * equals N of fromUnit. Default 1. Override if you want to phrase
   * the answer differently.
   */
  baseAmount?: number
  /**
   * The displayed direct answer text. Keep short, numbers front.
   * For data units, encode the binary vs decimal split here.
   */
  directAnswer: string
  /** Optional italic note below the direct answer, for nuance. */
  directAnswerNote?: string
  /** Paragraphs of explanatory context. Each entry is one paragraph. */
  context: string[]
  /** Exactly 3 worked examples. */
  examples: AnswerExample[]
  /**
   * Base values for the quick reference table. Renders rows like
   * "N toUnit = N * ratio fromUnit".
   * If omitted, sensible defaults are used for the category.
   */
  referenceTableBaseValues?: number[]
  faqs: AnswerFAQ[]
  /** Other /answers slugs to cross-link at the bottom. */
  relatedAnswerSlugs?: string[]
  /** Blog post slugs to cross-link. */
  relatedBlogSlugs?: string[]
  /** Publish date, ISO YYYY-MM-DD. */
  publishedDate: string
  /** Last update date, ISO YYYY-MM-DD. */
  lastUpdated: string
}

export const ANSWERS: Answer[] = [
  // --- Data storage: widget-free, developer audience, 1,024 vs 1,000 nuance ---
  {
    slug: "how-many-mb-in-a-gb",
    question: "How many MB in a GB?",
    metaDescription:
      "1 GB equals 1,024 MB using binary units (what your OS shows) or 1,000 MB using decimal units (what drive makers advertise). Free converter inside.",
    keywords: [
      "how many mb in a gb",
      "gb to mb",
      "megabytes in a gigabyte",
      "1 gb in mb",
      "binary vs decimal gb mb",
    ],
    searchVolumeEstimate: 90000,
    conversionPairSlug: "gb-to-mb",
    directAnswer: "1 GB = 1,024 MB (binary) or 1,000 MB (decimal SI).",
    directAnswerNote:
      "Operating systems use binary. Hard drive and SSD manufacturers use decimal. Both answers are technically correct.",
    context: [
      "The honest answer is that there are two answers, depending on who you ask. Your computer's file system, memory modules, and every major operating system use binary units where 1 GB equals 1,024 MB. Storage device makers like Seagate, Western Digital, and Samsung advertise in decimal units where 1 GB equals 1,000 MB. This is why a drive labeled 1 TB shows up as roughly 931 GB in Windows.",
      "In practical terms, use the binary number (1 GB = 1,024 MB) when you are checking file sizes, RAM, or available storage in your operating system. Use the decimal number (1 GB = 1,000 MB) when comparing marketed capacity on a spec sheet or box. The gap grows as you go up the scale: at 1 TB it is about 7%, at 1 PB it is closer to 10%.",
    ],
    examples: [
      {
        scenario:
          "You are downloading a 4 GB video file and your storage shows 4,096 MB of the drive is now used.",
        calculation: "4 GB × 1,024 = 4,096 MB.",
        takeaway:
          "The numbers match because the OS is using binary units for both the download and the drive display.",
      },
      {
        scenario:
          "You bought a 500 GB SSD but Windows says it is 465 GB.",
        calculation:
          "500 GB × 1,000,000,000 bytes = 500,000,000,000 bytes. Divided by 1,073,741,824 bytes per binary GB = ~465.66 GB.",
        takeaway:
          "The drive is the size advertised. Windows is just reporting the same capacity in binary units, which looks smaller.",
      },
      {
        scenario:
          "A cloud service says you have 15 GB free. You upload 14,500 MB of photos.",
        calculation: "14,500 MB ÷ 1,024 = 14.16 GB.",
        takeaway:
          "You will still have about 0.84 GB (860 MB) free. Most cloud providers use binary when showing used and free space.",
      },
    ],
    referenceTableBaseValues: [0.5, 1, 2, 4, 8, 16, 32, 64, 128],
    faqs: [
      {
        question: "Is 1 GB exactly 1024 MB?",
        answer:
          "In binary units (used by operating systems and RAM), yes: 1 GB = 1,024 MB exactly. In decimal SI units (used by drive manufacturers), 1 GB = 1,000 MB. The International Electrotechnical Commission actually calls the binary version a gibibyte (GiB), but almost nobody uses that term in everyday writing.",
      },
      {
        question: "Why does my 1 TB drive show up as 931 GB?",
        answer:
          "Drive manufacturers advertise in decimal (1 TB = 1,000,000,000,000 bytes). Windows and macOS display capacity in binary (1 TB = 1,099,511,627,776 bytes). The drive has the exact bytes advertised, but binary reporting makes the number look smaller by about 7%.",
      },
      {
        question: "Which definition should I use?",
        answer:
          "Use binary (1 GB = 1,024 MB) when you are dealing with files, RAM, operating system tools, or anything your computer reports. Use decimal (1 GB = 1,000 MB) when reading spec sheets, comparing marketed capacity, or calculating network transfer speeds (ISPs use decimal).",
      },
      {
        question: "How many megabytes are in a gigabyte of RAM?",
        answer:
          "8 GB of RAM is exactly 8,192 MB. RAM is always measured in binary because memory addresses are powers of 2.",
      },
      {
        question: "Is MB or GB bigger?",
        answer:
          "GB is bigger. 1 GB equals roughly 1,000 MB (or exactly 1,024 MB in binary). A file of 500 MB is smaller than a file of 1 GB.",
      },
      {
        question: "How many GB is 2000 MB?",
        answer:
          "2,000 MB equals roughly 1.95 GB in binary (2,000 ÷ 1,024) or exactly 2 GB in decimal (2,000 ÷ 1,000). Most software will display it as 1.95 GB.",
      },
    ],
    relatedAnswerSlugs: [
      "how-many-bytes-in-a-megabyte",
      "how-many-kb-in-a-mb",
      "how-many-gb-in-a-tb",
      "how-many-bytes-in-a-gb",
    ],
    publishedDate: "2026-04-23",
    lastUpdated: "2026-04-23",
  },
  {
    slug: "how-many-bytes-in-a-megabyte",
    question: "How many bytes in a megabyte?",
    metaDescription:
      "1 MB equals 1,048,576 bytes (binary) or 1,000,000 bytes (decimal). Full comparison of both definitions, with conversion examples and a free tool.",
    keywords: [
      "how many bytes in a megabyte",
      "bytes in a mb",
      "mb to bytes",
      "1 megabyte in bytes",
      "how many bytes in 1 mb",
    ],
    searchVolumeEstimate: 30000,
    conversionPairSlug: "mb-to-b",
    directAnswer:
      "1 MB = 1,048,576 bytes (binary) or 1,000,000 bytes (decimal SI).",
    directAnswerNote:
      "Operating systems, RAM, and most software count in binary. Network speeds and drive capacities are usually quoted in decimal.",
    context: [
      "A byte is the fundamental unit of computer storage, roughly the amount needed to hold one character of text. A megabyte is 2 to the 20th power bytes (1,048,576) when using binary units, the system built into how computers actually address memory. It is 1 million bytes flat when using decimal SI units, which is what gets printed on boxes and in marketing material.",
      "For any practical work with files on a computer, use 1,048,576. A 5 MB image really is about 5,242,880 bytes on disk. For comparing marketed storage capacity or calculating internet bandwidth, use 1,000,000. A 100 Mbps connection moves 100,000,000 bits (or 12.5 million bytes) per second.",
    ],
    examples: [
      {
        scenario: "Your text file is 500 KB. How many bytes is that?",
        calculation:
          "500 KB × 1,024 bytes/KB = 512,000 bytes (binary). Or 500 KB × 1,000 = 500,000 bytes (decimal).",
        takeaway:
          "Most file explorers use binary, so your text file is likely 512,000 bytes on disk.",
      },
      {
        scenario:
          "An API response is 2.5 MB. Your monthly API quota is in bytes, at 1,000,000,000 bytes.",
        calculation:
          "2.5 MB × 1,048,576 = 2,621,440 bytes per call. Quota allows 1,000,000,000 ÷ 2,621,440 = 381 calls.",
        takeaway:
          "You get roughly 381 API calls per month at this response size.",
      },
      {
        scenario:
          "A log file grows by 1 byte per entry and you want to know how many entries fit in 1 MB.",
        calculation: "1 MB = 1,048,576 bytes = 1,048,576 single-byte entries.",
        takeaway:
          "About 1.05 million entries fit in a megabyte if each one is exactly 1 byte.",
      },
    ],
    referenceTableBaseValues: [0.5, 1, 2, 5, 10, 25, 50, 100],
    faqs: [
      {
        question: "Is 1 MB exactly 1,000,000 bytes?",
        answer:
          "Only in decimal SI units. In binary (which computers actually use), 1 MB = 1,048,576 bytes. The ~5% difference matters on spec sheets.",
      },
      {
        question: "How many bytes in a KB?",
        answer:
          "1 KB = 1,024 bytes in binary, or 1,000 bytes in decimal. Operating systems use binary. A 10 KB file is 10,240 bytes in Windows or macOS.",
      },
      {
        question: "Why are there two definitions of a megabyte?",
        answer:
          "Computers are built around powers of 2 because memory is addressed in binary. Using 1,024 made sense for engineers. Later, marketing and SI standards pushed for 1,000,000 for consistency with other metric prefixes. The industry never fully agreed on one, so both coexist.",
      },
      {
        question: "What is a mebibyte (MiB)?",
        answer:
          "A mebibyte is the binary megabyte: exactly 1,048,576 bytes. The term was created by the IEC to eliminate ambiguity. Despite being technically correct, almost nobody uses MiB in everyday writing.",
      },
      {
        question: "How many megabytes are in a gigabyte?",
        answer:
          "1 GB = 1,024 MB in binary or 1,000 MB in decimal.",
      },
      {
        question: "How many bytes in 5 megabytes?",
        answer:
          "5 MB = 5,242,880 bytes in binary or 5,000,000 bytes in decimal.",
      },
    ],
    relatedAnswerSlugs: [
      "how-many-mb-in-a-gb",
      "how-many-kb-in-a-mb",
      "how-many-bytes-in-a-gb",
    ],
    publishedDate: "2026-04-23",
    lastUpdated: "2026-04-23",
  },
  {
    slug: "how-many-kb-in-a-mb",
    question: "How many KB in a MB?",
    metaDescription:
      "1 MB equals 1,024 KB (binary) or 1,000 KB (decimal). When to use each, worked examples for file sizes and internet speeds, and a free KB to MB converter.",
    keywords: [
      "how many kb in a mb",
      "kb to mb",
      "kilobytes in a megabyte",
      "1 mb in kb",
    ],
    searchVolumeEstimate: 35000,
    conversionPairSlug: "mb-to-kb",
    directAnswer: "1 MB = 1,024 KB (binary) or 1,000 KB (decimal SI).",
    directAnswerNote:
      "For file sizes on your computer, use 1,024. For internet speeds and marketed capacity, use 1,000.",
    context: [
      "The answer most people need is the binary one: 1 megabyte is 1,024 kilobytes, because operating systems count storage in powers of 2. When your file explorer says a file is 512 KB and you want to know if it fits in a 1 MB email attachment limit, that 1 MB means 1,024 KB, so yes, it fits.",
      "The decimal answer (1 MB = 1,000 KB) shows up in two common places: internet speed ratings (a 50 Mbps plan is measured in decimal megabits per second) and marketing text for storage devices. For everyday file work, stick with 1,024.",
    ],
    examples: [
      {
        scenario: "An email attachment limit is 25 MB. Your image is 27,500 KB.",
        calculation: "27,500 KB ÷ 1,024 = 26.86 MB.",
        takeaway:
          "The image is slightly over the limit. Compress it or resize before sending.",
      },
      {
        scenario:
          "A website has 3 MB of images on the home page and you want to know the total in KB.",
        calculation: "3 MB × 1,024 = 3,072 KB.",
        takeaway:
          "3 MB is a reasonable target for a page's image weight in 2026.",
      },
      {
        scenario: "Your ISP says 100 Mbps. How many KB per second is that?",
        calculation:
          "100 Mbps ÷ 8 = 12.5 MB/s (decimal) = 12,500 KB/s (decimal). Or ~12,207 KiB/s (binary).",
        takeaway:
          "At full speed, you download about 12.5 MB per second, or roughly one 12 MB photo per second.",
      },
    ],
    referenceTableBaseValues: [0.5, 1, 2, 5, 10, 25, 50, 100],
    faqs: [
      {
        question: "How many KB is 1 MB?",
        answer:
          "1 MB is 1,024 KB in binary units (what your OS uses) or 1,000 KB in decimal units (used in marketing and networking).",
      },
      {
        question: "Is 1024 KB a megabyte?",
        answer:
          "Yes, 1,024 KB equals 1 MB in binary units, which is how Windows, macOS, Linux, iOS, and Android all display file sizes.",
      },
      {
        question: "How many KB in a GB?",
        answer:
          "1 GB = 1,048,576 KB in binary, or 1,000,000 KB in decimal.",
      },
      {
        question: "Which is bigger, KB or MB?",
        answer:
          "MB is bigger. 1 MB equals about 1,000 KB. A 500 KB file is smaller than a 1 MB file.",
      },
      {
        question: "How many KB is 5 MB?",
        answer:
          "5 MB = 5,120 KB in binary, or 5,000 KB in decimal.",
      },
    ],
    relatedAnswerSlugs: [
      "how-many-mb-in-a-gb",
      "how-many-bytes-in-a-megabyte",
      "how-many-gb-in-a-tb",
    ],
    publishedDate: "2026-04-23",
    lastUpdated: "2026-04-23",
  },
  {
    slug: "how-many-gb-in-a-tb",
    question: "How many GB in a TB?",
    metaDescription:
      "1 TB equals 1,024 GB (binary) or 1,000 GB (decimal). Why your 1 TB drive shows 931 GB, how cloud providers count, and a free converter.",
    keywords: [
      "how many gb in a tb",
      "gb to tb",
      "gigabytes in a terabyte",
      "1 tb in gb",
      "why does my 1tb drive show 931gb",
    ],
    searchVolumeEstimate: 25000,
    conversionPairSlug: "tb-to-gb",
    directAnswer: "1 TB = 1,024 GB (binary) or 1,000 GB (decimal SI).",
    directAnswerNote:
      "This is why a 1 TB drive appears as roughly 931 GB in your OS. The drive is the size advertised; the display is in binary.",
    context: [
      "Drive makers use decimal: 1 TB is one trillion bytes exactly. Operating systems use binary: 1 TB of display capacity is 1,099,511,627,776 bytes. When Windows divides the drive's actual capacity (1,000,000,000,000 bytes) by the binary TB value, it ends up with 0.909 TB, or about 931 GB. Nothing is missing. It is a unit mismatch.",
      "Cloud storage providers are split. Google Drive, Dropbox, and iCloud use decimal (1 TB = 1,000 GB). Backblaze and some enterprise providers use binary. If you have exactly 1 TB of storage and you see 1,024 GB or 1,000 GB used differently on two services, that is usually why.",
    ],
    examples: [
      {
        scenario:
          "You just bought a 2 TB external drive. How much usable space will Windows show?",
        calculation:
          "2 TB × 1,000,000,000,000 = 2,000,000,000,000 bytes. Divided by 1,099,511,627,776 = 1.82 TB, or about 1,862 GB.",
        takeaway:
          "Expect Windows to show ~1.82 TB or ~1,862 GB free, minus any filesystem overhead.",
      },
      {
        scenario:
          "A cloud plan gives you 1 TB. You upload 900 GB of photos.",
        calculation: "900 GB ÷ 1,000 = 0.9 TB (decimal) or 900 ÷ 1,024 = 0.879 TB (binary).",
        takeaway:
          "On a decimal provider (Google, Dropbox), you still have 100 GB free. On a binary provider, you have 124 GB free.",
      },
      {
        scenario:
          "You are comparing a 4 TB drive at $80 to an 8 TB drive at $130. How much is each per GB?",
        calculation:
          "$80 ÷ 4,000 GB = $0.020/GB. $130 ÷ 8,000 GB = $0.01625/GB.",
        takeaway:
          "The 8 TB drive is 19% cheaper per GB. Drives get cheaper per GB at larger sizes, up to a point.",
      },
    ],
    referenceTableBaseValues: [0.5, 1, 2, 4, 8, 16, 32],
    faqs: [
      {
        question: "How many GB is 1 TB?",
        answer:
          "1 TB equals 1,024 GB in binary (what your OS shows) or 1,000 GB in decimal (what the drive box says).",
      },
      {
        question: "Why does my 1 TB drive only show 931 GB?",
        answer:
          "The drive actually holds 1 trillion bytes, which is the advertised 1 TB in decimal. Your OS converts that to binary units where 1 TB = 1,099,511,627,776 bytes, so 1 trillion bytes displays as 931.32 GB. No bytes are missing.",
      },
      {
        question: "Is 1000 GB a terabyte?",
        answer:
          "In decimal units, yes. 1,000 GB is exactly 1 TB under the SI prefix definition. Drive manufacturers use this definition. In binary units, 1 TB is 1,024 GB.",
      },
      {
        question: "How many TB is 500 GB?",
        answer:
          "500 GB is 0.5 TB in decimal or 0.488 TB in binary. Most software will display it as 0.49 TB.",
      },
      {
        question: "Is TB bigger than GB?",
        answer:
          "Yes. 1 TB equals about 1,000 GB (exactly 1,024 GB in binary). TB is three orders of magnitude larger than MB.",
      },
    ],
    relatedAnswerSlugs: [
      "how-many-mb-in-a-gb",
      "how-many-kb-in-a-mb",
      "how-many-bytes-in-a-gb",
    ],
    publishedDate: "2026-04-23",
    lastUpdated: "2026-04-23",
  },
  {
    slug: "how-many-bytes-in-a-gb",
    question: "How many bytes in a GB?",
    metaDescription:
      "1 GB equals 1,073,741,824 bytes (binary) or 1,000,000,000 bytes (decimal). Full breakdown with worked examples and a free GB to bytes converter.",
    keywords: [
      "how many bytes in a gb",
      "bytes in a gigabyte",
      "gb to bytes",
      "1 gb in bytes",
    ],
    searchVolumeEstimate: 20000,
    conversionPairSlug: "gb-to-b",
    directAnswer:
      "1 GB = 1,073,741,824 bytes (binary) or 1,000,000,000 bytes (decimal SI).",
    directAnswerNote:
      "The 7% gap between the two is why a 1 TB drive shows up as 931 GB in your OS.",
    context: [
      "A gigabyte in binary is exactly 2 to the 30th power bytes, which works out to 1,073,741,824. Operating systems, RAM chips, and most desktop software use this definition because memory addresses are binary. When you check a file size or free disk space in your OS, that number is in binary bytes.",
      "In decimal SI units, a gigabyte is exactly one billion bytes (1,000,000,000). Drive manufacturers, ISPs, and anything referencing the International System of Units uses this definition. The difference is small at the MB level (about 5%) but grows to 7% at GB, 10% at TB, and keeps widening.",
    ],
    examples: [
      {
        scenario:
          "You are writing a script that processes log files and want to know how many bytes you can fit in 2 GB of memory.",
        calculation: "2 GB × 1,073,741,824 = 2,147,483,648 bytes.",
        takeaway:
          "You can buffer about 2.15 billion bytes. Use binary because RAM is binary.",
      },
      {
        scenario:
          "A database row averages 512 bytes. How many rows fit in 1 GB?",
        calculation: "1,073,741,824 ÷ 512 = 2,097,152 rows.",
        takeaway:
          "About 2.1 million rows fit in 1 GB of binary storage at that row size.",
      },
      {
        scenario:
          "You transfer 3 GB over a 1 Gbps network connection at full speed.",
        calculation:
          "3 GB × 1,000,000,000 bytes (decimal, network) = 3,000,000,000 bytes. ÷ 125,000,000 bytes/sec (1 Gbps) = 24 seconds.",
        takeaway:
          "Network transfer time calculations use decimal, not binary.",
      },
    ],
    referenceTableBaseValues: [0.5, 1, 2, 4, 8, 16, 32],
    faqs: [
      {
        question: "How many bytes in 1 GB?",
        answer:
          "1 GB = 1,073,741,824 bytes in binary (what OS tools count) or 1,000,000,000 bytes in decimal (what marketing uses).",
      },
      {
        question: "Is 1 GB 1 billion bytes?",
        answer:
          "Only in decimal. In binary (used by operating systems), 1 GB is about 1.074 billion bytes. The 7.4% gap is what causes the 1 TB drive showing 931 GB mystery.",
      },
      {
        question: "How many bytes in a megabyte?",
        answer:
          "1 MB equals 1,048,576 bytes in binary or 1,000,000 bytes in decimal.",
      },
      {
        question: "What is a gibibyte (GiB)?",
        answer:
          "GiB is the IEC binary term for gigabyte: exactly 1,073,741,824 bytes. It was created to eliminate ambiguity with GB, but almost nobody uses it in practice.",
      },
      {
        question: "How many bytes in 5 GB?",
        answer:
          "5 GB = 5,368,709,120 bytes in binary, or 5,000,000,000 bytes in decimal.",
      },
    ],
    relatedAnswerSlugs: [
      "how-many-mb-in-a-gb",
      "how-many-bytes-in-a-megabyte",
      "how-many-gb-in-a-tb",
    ],
    publishedDate: "2026-04-23",
    lastUpdated: "2026-04-23",
  },

  // --- Area: high volume real-estate / land queries ---
  {
    slug: "how-many-square-feet-in-an-acre",
    question: "How many square feet in an acre?",
    metaDescription:
      "1 acre equals exactly 43,560 square feet. Where the number comes from, common lot sizes compared, and a free square feet to acre converter.",
    keywords: [
      "how many square feet in an acre",
      "square feet in an acre",
      "acre to square feet",
      "sqft in an acre",
      "1 acre in sqft",
    ],
    searchVolumeEstimate: 110000,
    conversionPairSlug: "acre-to-sqft",
    directAnswer: "1 acre = 43,560 square feet.",
    directAnswerNote:
      "The number comes from an acre being historically defined as 1 chain by 1 furlong: 66 feet × 660 feet = 43,560 square feet.",
    context: [
      "An acre is an imperial unit of area used almost everywhere in the US for real estate, farmland, and large construction sites. It works out to exactly 43,560 square feet, a number that looks arbitrary until you know its origin: medieval England defined an acre as the land one ox could plow in a day, which formalized into a rectangle of one chain (66 feet) by one furlong (660 feet).",
      "For most Americans, the usable mental model is this: an acre is about 90% the size of an American football field, including the end zones. A typical suburban lot is one-quarter to one-half of an acre. A standard Manhattan city block is roughly 2 acres.",
    ],
    examples: [
      {
        scenario:
          "A listing says the home sits on 0.35 acres. How big is the lot in square feet?",
        calculation: "0.35 × 43,560 = 15,246 square feet.",
        takeaway:
          "That is a roughly 15,000 sq ft lot, which is comfortably larger than average in most US suburbs.",
      },
      {
        scenario:
          "You are buying 5 acres of land for a cabin. How big is that in square feet?",
        calculation: "5 × 43,560 = 217,800 square feet.",
        takeaway:
          "About 218,000 sq ft, roughly the area of four American football fields or a large Costco parking lot.",
      },
      {
        scenario:
          "A community garden plot is 1,200 sq ft. What fraction of an acre is that?",
        calculation: "1,200 ÷ 43,560 = 0.0275 acres.",
        takeaway:
          "Just under 3% of an acre, about the size of a small backyard.",
      },
    ],
    referenceTableBaseValues: [0.1, 0.25, 0.5, 1, 2, 5, 10],
    faqs: [
      {
        question: "How big is an acre in square feet?",
        answer:
          "Exactly 43,560 square feet. The number is fixed by historical definition (1 chain by 1 furlong) and has not changed.",
      },
      {
        question: "How big is an acre visually?",
        answer:
          "Roughly 90% the size of an American football field including both end zones. A square acre would measure about 208 feet on each side.",
      },
      {
        question: "How many acres is 10,000 square feet?",
        answer: "10,000 ÷ 43,560 = 0.2296 acres. Just under a quarter acre.",
      },
      {
        question: "How many acres is 43,560 square feet?",
        answer:
          "Exactly 1 acre. This is the legal definition of an acre in the imperial system.",
      },
      {
        question: "Is half an acre 21,780 square feet?",
        answer: "Yes. 43,560 ÷ 2 = 21,780 sq ft.",
      },
      {
        question: "How many square feet is a quarter acre?",
        answer:
          "10,890 sq ft. A quarter acre is a common residential lot size in the US suburbs.",
      },
    ],
    relatedAnswerSlugs: [
      "how-many-hectares-in-an-acre",
    ],
    publishedDate: "2026-04-23",
    lastUpdated: "2026-04-23",
  },
  {
    slug: "how-many-hectares-in-an-acre",
    question: "How many hectares in an acre?",
    metaDescription:
      "1 acre equals 0.4047 hectares, or roughly 0.4 hectares. A hectare is 2.47 acres. Full conversion table and a free hectare to acre converter.",
    keywords: [
      "how many hectares in an acre",
      "acre to hectare",
      "hectare to acre",
      "1 acre in hectares",
      "1 hectare in acres",
    ],
    searchVolumeEstimate: 5000,
    conversionPairSlug: "acre-to-ha",
    directAnswer: "1 acre = 0.4047 hectares (or 1 hectare = 2.471 acres).",
    directAnswerNote:
      "Quick mental math: multiply acres by 0.4 to get a close hectare estimate, or multiply hectares by 2.5 to get acres.",
    context: [
      "The acre is the imperial/US unit for land area, while the hectare is the metric unit used almost everywhere else. One hectare is exactly 10,000 square meters, while one acre is 43,560 square feet (4,046.86 square meters). The conversion between them is therefore fixed and exact.",
      "You will see hectares on real estate listings outside the US and Canada, on farm subsidies and agricultural reports globally, and in international news coverage of land use. A typical commercial farm in the US is quoted in hundreds or thousands of acres; the same farm in Europe would be quoted in hundreds of hectares.",
    ],
    examples: [
      {
        scenario:
          "A French countryside listing says the property is 3 hectares. How many acres is that?",
        calculation: "3 × 2.471 = 7.41 acres.",
        takeaway:
          "About 7.5 acres, a decent-sized rural lot by US standards.",
      },
      {
        scenario:
          "A news report mentions a 500-acre wildfire. What is that in hectares?",
        calculation: "500 × 0.4047 = 202.3 hectares.",
        takeaway:
          "Roughly 200 hectares, or 2 square kilometers.",
      },
      {
        scenario:
          "You own 12 acres of farmland and want to compare to a European neighbor who owns 5 hectares.",
        calculation: "12 × 0.4047 = 4.86 hectares. 5 × 2.471 = 12.36 acres.",
        takeaway:
          "Your 12 acres is roughly equal to the neighbor's 5 hectares. They have a few percent more land.",
      },
    ],
    referenceTableBaseValues: [0.5, 1, 2, 5, 10, 25, 50, 100],
    faqs: [
      {
        question: "Is 1 acre 0.4 hectares?",
        answer:
          "Approximately. 1 acre is 0.4047 hectares exactly. The 0.4 estimate is within 1% and works fine for quick mental math.",
      },
      {
        question: "How many acres are in a hectare?",
        answer:
          "1 hectare = 2.471 acres. A good rule of thumb is to multiply hectares by 2.5 to get an approximate acre count.",
      },
      {
        question: "Which is bigger, an acre or a hectare?",
        answer:
          "A hectare. 1 hectare is 10,000 square meters (107,639 sq ft), about 2.47 times larger than an acre.",
      },
      {
        question: "How many hectares in 100 acres?",
        answer: "100 × 0.4047 = 40.47 hectares.",
      },
      {
        question: "How do you convert acres to hectares quickly?",
        answer:
          "Divide by 2.5 for a close estimate. 100 acres ÷ 2.5 = 40 hectares, which is accurate to within 1%.",
      },
    ],
    relatedAnswerSlugs: [
      "how-many-square-feet-in-an-acre",
    ],
    publishedDate: "2026-04-23",
    lastUpdated: "2026-04-23",
  },

  // --- Volume / cooking: huge volume, widget-inconsistent ---
  {
    slug: "how-many-tablespoons-in-a-cup",
    question: "How many tablespoons in a cup?",
    metaDescription:
      "1 cup equals 16 tablespoons exactly. Full cooking conversion table (tsp, tbsp, cup, fluid ounce) and a free volume converter.",
    keywords: [
      "how many tablespoons in a cup",
      "tablespoons in a cup",
      "tbsp in a cup",
      "cup to tbsp",
      "1 cup to tablespoons",
    ],
    searchVolumeEstimate: 90000,
    conversionPairSlug: "cup-to-tbsp",
    directAnswer: "1 US cup = 16 tablespoons (tbsp).",
    directAnswerNote:
      "US cooking measurements. The UK and Australia define a tablespoon slightly differently, which matters for baking.",
    context: [
      "In standard US cooking measurements, 1 cup equals 16 tablespoons exactly. A tablespoon is 3 teaspoons, so a cup is also 48 teaspoons or 8 fluid ounces. These are the numbers in almost every American recipe.",
      "If you follow a British, Australian, or metric recipe, the numbers shift a little. A UK tablespoon is 15 mL compared to the US 14.79 mL (close enough for cooking). An Australian tablespoon is 20 mL, so 1 cup equals only 12.5 Australian tablespoons. For baking, where ratios matter more than absolute volume, stick with the origin country's definition to avoid surprises.",
    ],
    examples: [
      {
        scenario:
          "A recipe calls for 1/2 cup of butter but you only have a tablespoon measure.",
        calculation: "1/2 × 16 = 8 tablespoons.",
        takeaway: "Use 8 tablespoons of butter. (Also happens to be 1 stick.)",
      },
      {
        scenario:
          "You are scaling a recipe up 3x and need 3 cups of olive oil. The bottle's pour cap only dispenses tablespoons.",
        calculation: "3 × 16 = 48 tablespoons.",
        takeaway:
          "That is a lot of counting. A measuring cup will be much faster.",
      },
      {
        scenario:
          "A sauce recipe needs 1/4 cup of soy sauce. How many tablespoons?",
        calculation: "16 ÷ 4 = 4 tablespoons.",
        takeaway:
          "4 tablespoons of soy sauce. Easy to eyeball with a regular spoon if you do not have a tablespoon measure.",
      },
    ],
    referenceTableBaseValues: [0.125, 0.25, 0.33, 0.5, 0.67, 0.75, 1, 2],
    faqs: [
      {
        question: "How many tablespoons in 1 cup?",
        answer:
          "16 US tablespoons make up 1 US cup. This is the standard used in US cookbooks and on US measuring cups.",
      },
      {
        question: "How many tablespoons in 1/2 cup?",
        answer: "8 tablespoons. Also 24 teaspoons or 4 fluid ounces.",
      },
      {
        question: "How many tablespoons in 1/4 cup?",
        answer: "4 tablespoons. Also 12 teaspoons or 2 fluid ounces.",
      },
      {
        question: "How many tablespoons in 1/3 cup?",
        answer:
          "Approximately 5 tablespoons plus 1 teaspoon (5.33 tbsp exactly). Most cookbooks round to 5 tablespoons + 1 teaspoon.",
      },
      {
        question: "How many tablespoons in 3/4 cup?",
        answer: "12 tablespoons. Also 36 teaspoons or 6 fluid ounces.",
      },
      {
        question: "Is a UK tablespoon the same as a US tablespoon?",
        answer:
          "Close but not exact. UK tablespoon = 15 mL, US tablespoon = 14.79 mL. Australia uses 20 mL, which is noticeably bigger.",
      },
      {
        question: "How many tablespoons in a stick of butter?",
        answer:
          "1 stick of US butter = 8 tablespoons = 1/2 cup = 4 oz = 113 grams. Every stick is stamped with tablespoon markings.",
      },
    ],
    relatedAnswerSlugs: [
      "how-many-ml-in-a-tablespoon",
    ],
    publishedDate: "2026-04-23",
    lastUpdated: "2026-04-23",
  },
  {
    slug: "how-many-ml-in-a-tablespoon",
    question: "How many ml in a tablespoon?",
    metaDescription:
      "1 US tablespoon equals 14.79 ml. UK tablespoons are 15 ml and Australian tablespoons are 20 ml. Quick cooking conversion chart inside.",
    keywords: [
      "how many ml in a tablespoon",
      "tablespoon to ml",
      "ml in a tbsp",
      "tbsp to ml",
      "us tablespoon ml",
    ],
    searchVolumeEstimate: 15000,
    conversionPairSlug: "tbsp-to-ml",
    directAnswer:
      "1 US tablespoon = 14.79 ml. A UK tablespoon is 15 ml. An Australian tablespoon is 20 ml.",
    directAnswerNote:
      "For everyday cooking, 15 ml is close enough for all three. For baking, match the recipe's origin country.",
    context: [
      "Tablespoons are not the same everywhere. The US tablespoon is defined as 1/2 fluid ounce, which works out to 14.787 ml. The UK standardized theirs to exactly 15 ml, which is slightly larger. Australia went even further and uses 20 ml tablespoons, a noticeable difference when scaled across a whole recipe.",
      "In savory cooking, the differences are small enough to ignore. In baking, where the ratio of flour to fat to liquid matters, using the wrong tablespoon size can throw off texture. If a recipe was published in Australia and you use a US tablespoon, you are under-pouring by 25%. Converting to grams by weight (not volume) is the safest fix for serious baking.",
    ],
    examples: [
      {
        scenario:
          "A recipe says 3 tablespoons of olive oil. You only have a milliliter-marked measuring cup.",
        calculation: "3 × 14.79 = 44.4 ml.",
        takeaway:
          "Pour a little over 44 ml. Round to 45 for easier pouring.",
      },
      {
        scenario:
          "An Australian recipe calls for 2 tablespoons of vanilla essence. You are using US tablespoons.",
        calculation: "2 Australian tbsp × 20 = 40 ml. 40 ml ÷ 14.79 = 2.7 US tablespoons.",
        takeaway:
          "Use about 2 and 3/4 US tablespoons, not 2.",
      },
      {
        scenario:
          "A cocktail recipe asks for 15 ml of simple syrup. You only have tablespoons.",
        calculation:
          "15 ml ÷ 14.79 ml/tbsp = 1.014 tablespoons. Essentially 1 level tablespoon.",
        takeaway:
          "A level US tablespoon is 99% of 15 ml. Close enough for cocktails.",
      },
    ],
    referenceTableBaseValues: [0.5, 1, 2, 3, 4, 5, 10, 20],
    faqs: [
      {
        question: "Is 1 tablespoon 15 ml?",
        answer:
          "In the UK, yes exactly. In the US, 1 tablespoon is 14.79 ml (close to 15). In Australia, 1 tablespoon is 20 ml.",
      },
      {
        question: "How many ml is 1 teaspoon?",
        answer:
          "1 US teaspoon = 4.93 ml. 1 UK teaspoon = 5 ml. There are 3 teaspoons in a tablespoon in all three systems.",
      },
      {
        question: "How many ml in 2 tablespoons?",
        answer:
          "2 US tablespoons = 29.57 ml. 2 UK tablespoons = 30 ml. 2 Australian tablespoons = 40 ml.",
      },
      {
        question: "Is 5 ml a tablespoon?",
        answer:
          "No. 5 ml is 1 teaspoon. A tablespoon is 3 times larger, at 14.79 ml (US) or 15 ml (UK).",
      },
      {
        question: "How many ml is a stick of butter worth in tablespoons?",
        answer:
          "1 US stick of butter = 8 tablespoons = 118.3 ml by volume. By weight, a stick is 113 grams.",
      },
    ],
    relatedAnswerSlugs: [
      "how-many-tablespoons-in-a-cup",
    ],
    publishedDate: "2026-04-23",
    lastUpdated: "2026-04-23",
  },
]

/** Find an Answer by slug. */
export function getAnswerBySlug(slug: string): Answer | undefined {
  return ANSWERS.find((a) => a.slug === slug)
}

/** List all Answers sorted by most recent publish first. */
export function getAllAnswers(): Answer[] {
  return [...ANSWERS].sort((a, b) =>
    b.publishedDate.localeCompare(a.publishedDate),
  )
}

/** Look up the ConversionPair backing an Answer. */
export function getAnswerConversionPair(
  answer: Answer,
): ConversionPair | undefined {
  return ALL_CONVERSION_PAIRS.find((p) => p.slug === answer.conversionPairSlug)
}

/** Get related Answers (explicit first, then same-category fill). */
export function getRelatedAnswers(answer: Answer, limit = 4): Answer[] {
  const explicit = (answer.relatedAnswerSlugs ?? [])
    .map(getAnswerBySlug)
    .filter((a): a is Answer => !!a)
  if (explicit.length >= limit) return explicit.slice(0, limit)

  const pair = getAnswerConversionPair(answer)
  const categorySlug = pair?.category.slug

  const fallback = getAllAnswers().filter((a) => {
    if (a.slug === answer.slug) return false
    if (explicit.some((e) => e.slug === a.slug)) return false
    const aPair = getAnswerConversionPair(a)
    return aPair?.category.slug === categorySlug
  })

  return [...explicit, ...fallback].slice(0, limit)
}

/** Group all Answers by their underlying conversion category. */
export function getAnswersByCategory(): Array<{
  categorySlug: string
  categoryName: string
  answers: Answer[]
}> {
  const groups = new Map<
    string,
    { categorySlug: string; categoryName: string; answers: Answer[] }
  >()
  for (const answer of getAllAnswers()) {
    const pair = getAnswerConversionPair(answer)
    if (!pair) continue
    const key = pair.category.slug
    if (!groups.has(key)) {
      groups.set(key, {
        categorySlug: key,
        categoryName: pair.category.name,
        answers: [],
      })
    }
    groups.get(key)!.answers.push(answer)
  }
  return Array.from(groups.values())
}
