export type ContentBlock =
  | { type: "subtitle"; text: string }
  | { type: "p"; text: string; muted?: boolean }
  | { type: "h2"; text: string }
  | {
      type: "image";
      src: string;
      alt: string;
      width: number;
      height: number;
      caption?: string;
    }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "facts"; items: [string, string][] }
  | { type: "links"; items: [string, string][] };

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: ContentBlock[];
};

export const posts: Post[] = [
  {
    slug: "memory-lane-parsing-24000-imessages",
    title: "Memory Lane, by Trial and Error: Parsing 24,000 iMessages",
    date: "2026-08-16",
    excerpt:
      "Five people, 24,000 messages, and a chat.db file that fights you at every step — on timestamps, on where the text even lives, and on what counts as a message at all.",
    content: [
      {
        type: "subtitle",
        text: "What five people's group chat looks like once you stop scrolling it and start querying it.",
      },
      {
        type: "p",
        text: "Every so often I get the urge to point a model at something that isn't a spreadsheet of public data. This time it was my toronto group chat. We migrated it to imsg just recently from instagram starting in june so the numbers are a bit skewed, but it's still a decent sample size. It's sitting in a SQLite file on my own laptop the whole time.",
      },
      {
        type: "p",
        text: "~/Library/Messages/chat.db. No API, no rate limit, no auth flow. Just a database Apple has been quietly writing to since the day I set up iMessage. I opened it expecting a SELECT * FROM messages afternoon project. It was not that.",
      },
      {
        type: "image",
        src: "/blogs/2/4.png",
        alt: "Bar chart, Message Count per Person: Me 3659, rz 1833, bt 1902, jin 2618, jess 194.",
        width: 2034,
        height: 1282,
        caption:
          "The imbalance you already knew was there, now with a denominator. Five people, 24,000 messages total across every thread in the export, and this one group's split alone spans a 19x range top to bottom.",
      },
      { type: "h2", text: "The text isn't where you think it is" },
      {
        type: "p",
        text: "First trap: SELECT text FROM message returns NULL for a huge chunk of recent rows. The column isn't gone, it's just not where iMessage puts text anymore. Since a macOS update years back, message bodies live inside attributedBody, an NSKeyedArchiver-serialized blob, because a chat bubble apparently needed to remember its own font. Getting a plain string back out means unarchiving a binary plist and walking the object graph for the NSString payload. The text column still works for old messages and reactions; everything else needed the blob path.",
      },
      { type: "h2", text: "Timestamps lie if you assume Unix epoch" },
      {
        type: "p",
        text: "Second trap, and the one that cost the most time: date in the messages table isn't Unix time. It's nanoseconds since January 1, 2001, Apple's Core Data epoch, and for a while my hourly activity numbers were shifted so hard that everyone appeared to text most heavily sometime around 2001. Once corrected, the pattern actually made sense.",
      },
      {
        type: "image",
        src: "/blogs/2/3.png",
        alt: "Heatmap of message activity by hour of day for each of the five people, showing an evening peak.",
        width: 2154,
        height: 914,
        caption:
          "Me at a clean peak around 6–7pm, jin right behind, jess barely registering outside a narrow afternoon band. Nobody in this chat is texting at 3am. We're boring that way.",
      },
      { type: "h2", text: "A reaction is a message pretending to be a reply" },
      {
        type: "p",
        text: "Tapbacks (heart, thumbs up, double exclamation) aren't in a separate table either. They're rows in the same message table, linked to the original via associated_message_guid, prefixed with a type code that tells you whether it's a love, a laugh, or a removed reaction undoing an earlier one. Skip filtering these out and every count in this post, message totals, word counts, everything, quietly inflates.",
      },
      { type: "h2", text: "Once the data's honest, the fun stats show up" },
      {
        type: "p",
        text: "With text decoded, timestamps fixed, and reactions separated from real messages, the rest was just counting things properly.",
      },
      {
        type: "image",
        src: "/blogs/2/2.png",
        alt: "Bar chart, Conversation Starters, first message after a 4 hour or more gap: Me 29, rz 7, bt 8, jin 33, jess 5.",
        width: 2052,
        height: 1284,
        caption:
          "jin opens the chat back up more than anyone (33 times), followed closely by me (29). rz, bt, and jess mostly wait to be texted first.",
      },
      {
        type: "image",
        src: "/blogs/2/1.png",
        alt: "Two bar charts side by side: Distinct Words Used per Person, and Vocabulary Richness as distinct over total words, for each of the five people.",
        width: 2204,
        height: 852,
        caption:
          "I've sent the most messages and the most distinct words in absolute terms, but the lowest type-token ratio in the group (0.159), I say a lot, but I repeat myself doing it. jess, at the other end, has the smallest vocabulary in raw count but the highest richness (0.452): fewer messages, less repetition per message.",
      },
      {
        type: "image",
        src: "/blogs/2/namedrop.png",
        alt: "Bar chart, Name Drops per Person, split by mentions from others versus mentions by self.",
        width: 1216,
        height: 670,
        caption:
          "bt is talked about more than anyone else in the chat (323 mentions) despite not being the most frequent texter. Self-mentions are near zero across the board, nobody in this group refers to themselves by name, which in hindsight is just how texting works.",
      },
      {
        type: "p",
        muted: true,
        text: "Parsed directly from chat.db via sqlite3 in Python; text extracted from attributedBody where the plain text column was empty, timestamps converted from Apple's Core Data epoch, and reactions filtered out via associated_message_guid before counting.",
      },
    ],
  },
  {
    slug: "i-built-a-model-to-beat-baseball",
    title: "I Built a Model to Beat Baseball. It Taught Me Why I Couldn't.",
    date: "2026-07-28",
    excerpt:
      "A negative-binomial model, 670,000 leakage-safe plate appearances, and a holdout result that ties a coin flip on purpose, honestly, and with the receipts to prove it.",
    content: [
      {
        type: "subtitle",
        text: "670,000 plate appearances, a negative binomial, and the most useful failure I've shipped.",
      },
      { type: "p", text: "I lost money betting on baseball." },
      {
        type: "p",
        text: "Not a catastrophic amount, but enough that I stopped telling my roommates about it, and enough that the stubborn part of my brain refused to let it go. I don't hate losing money. I hate losing money to randomness I could have modeled. So I did the thing every stats undergrad does when they get annoyed: I decided to build a model.",
      },
      {
        type: "p",
        text: "The plan was simple. Predict the total runs in a game better than the sportsbook, find the gaps, print money. You can already tell from the title how that went.",
      },
      {
        type: "p",
        text: "Here's what actually happened, why it's more interesting than a win would have been, and everything I'd tell you if you were about to try the same thing.",
      },
      {
        type: "image",
        src: "/blogs/1/gameview.png",
        alt: "The dashboard's slate view: a list of the day's games, each with a projected score, a projected total with a plus-or-minus, and a small distribution shape.",
        width: 2940,
        height: 1604,
        caption:
          "The tool I ended up with: every game on the day's board, each with a projected total and the full shape of possible outcomes. Note the spread here, 7.4 for Brewers–Giants up to 9.5 for Blue Jays–Nationals. It varies night to night; this is a fuller slate than some, and on tighter nights the games bunch up much closer together, which turned out to matter more than I expected. More on that later.",
      },
      { type: "h2", text: "The number nobody wants to hear first" },
      {
        type: "p",
        text: "Before I wrote a line of modeling code, I did one calculation that should have talked me out of the whole project. I'm glad I ran it now, because it reframed everything.",
      },
      { type: "p", text: "How predictable is a baseball game, at best?" },
      {
        type: "p",
        text: "I simulated it. Take realistic spreads for how much teams differ in offense, pitching, and ballpark, and ask: if you knew all of that perfectly, how much of a game's final total could you explain? The answer is about 9%.",
      },
      {
        type: "p",
        text: "Ninety-one percent of a baseball game is noise. Bloops that fall in. Rockets hit straight at fielders. A checked-swing single in the ninth. The stuff no model can touch because it isn't a function of anything knowable beforehand.",
      },
      {
        type: "p",
        text: "That number does something important: it changes what “good” means. If you chase point accuracy, insisting the total will be 8.7, you will look like a failure no matter how good your model is, because you'll be off by three runs on average and so will God's own model. So I stopped trying to predict the score. I aimed for something achievable instead: calibration. When my model says there's a 60% chance the game goes over 8.5, it should go over about 60% of the time. You can't predict the score. You can predict the odds.",
      },
      {
        type: "p",
        text: "That reframe is the single most useful thing in this whole post. Hold onto it.",
      },
      {
        type: "image",
        src: "/blogs/1/prediction.png",
        alt: "Total runs distribution for Phillies at Marlins: a right-skewed curve peaking around 6-7 runs, with P(total >= 7) = 60%, P(>= 8) = 50%, P(>= 9) = 40%, P(>= 10) = 32%, P(>= 11) = 25%. Win probability PHI 58% / MIA 42%.",
        width: 1802,
        height: 1476,
        caption:
          "This is what the model actually produces, not a number, a shape. Phillies at Marlins, projected total 8.0. But look where the curve peaks: around 6 or 7, not 8. Run scoring is lopsided: a handful of blowouts drag the average up above where most games actually land, so the most likely single outcome sits below the “projected” total. That's why the model reads out probabilities (60% chance of 7+ runs, 25% chance of 11+) instead of one confident guess. A single number would hide the entire story this curve is telling.",
      },
      { type: "h2", text: "What the model actually looks at" },
      {
        type: "p",
        text: "A baseball game's run total comes down to a small number of things, and I wanted the model to use the honest version of each.",
      },
      {
        type: "p",
        text: "How well a team hits, measured by process rather than luck. The naive move is to rate offense by runs scored. The problem: runs are contaminated by sequencing and luck. Three singles in one inning score a run; the same three singles spread across three innings score nothing. A 105-mph line drive right at the shortstop is an out; a 60-mph bloop that drops is a hit. Runs reward the bloop and punish the rocket, which is exactly backwards if you're trying to predict the future.",
      },
      {
        type: "p",
        text: "So instead of runs, the model uses xwOBA, expected weighted on-base average. It grades each plate appearance by how hard and at what angle the ball was hit, then asks how often balls hit like that become hits historically. The rocket-at-the-shortstop gets credited as the good swing it was. The lucky bloop gets little. It measures what a team did, stripped of what luck did to them, and it predicts future scoring better than past scoring does.",
      },
      {
        type: "p",
        text: "The pitching, starter and bullpen, rated separately by FIP, which is built only from what a pitcher controls (strikeouts, walks, home runs) and ignores the defense behind him. Starter and bullpen are split apart and weighted by how long the starter is expected to last, because “the pitching” is really two different pitching staffs having two different nights.",
      },
      {
        type: "p",
        text: "The ballpark. Coors Field inflates scoring; pitcher-friendly parks knock it down. A simple multiplier.",
      },
      {
        type: "p",
        text: "The era. Leaguewide scoring drifts season to season, since the ball itself changes. A rolling league-average term keeps the model anchored to the current run environment instead of assuming baseball scores the same forever.",
      },
      {
        type: "image",
        src: "/blogs/1/model.png",
        alt: "The deployed model's coefficients: intercept 1.29, log(offense) 1.14, starter 0.90, bullpen 1.21, park 0.81, home 0.002, dispersion k=3.53, trained on 14,544 team-games from 2023-25.",
        width: 1600,
        height: 1178,
        caption:
          "The coefficients, straight from the live dashboard. Each one is a shrinkage factor: how much of a feature's nominal signal actually survives into runs. Offense (b1) comes out at 1.14: a team's recent hitting matters, but nothing like face value, because recent stats overstate true talent. The home-field term (b5) lands at essentially zero, since real home advantage almost exactly cancels the fact that home teams skip the bottom of the ninth when they're already winning. And note the footnote in the corner: this model was picked by its score on a held-out season, not by how well it fit the data it trained on. Selecting on in-sample fit is another quiet way to fool yourself, and it's the kind of thing you have to decide up front to avoid.",
      },
      { type: "h2", text: "The part that separates real models from fake ones" },
      {
        type: "p",
        text: "Here's where most “I beat Vegas” projects quietly fall apart, and where I spent the majority of my effort.",
      },
      { type: "p", text: "You are not allowed to use the future." },
      {
        type: "p",
        text: "It sounds obvious. It is not obvious in practice, because the trap is invisible. A team's season-long xwOBA is sitting right there in the data, and it's the natural number to grab. But if I use the Yankees' full-2026 xwOBA to predict their game on July 27, I've cheated: that season average already contains July 27, and every game after it. I'd be using the answer to predict the answer.",
      },
      {
        type: "p",
        text: "This is called data leakage, and it's the number one way sports and finance modelers fool themselves. Nothing errors out. The code runs clean. The model produces gorgeous accuracy, then falls apart the instant you point it at a genuinely upcoming game, because for a real future game, that “future” data doesn't exist yet.",
      },
      {
        type: "p",
        text: "So every single input in my model is computed using only games played before the one being predicted. To rate the Yankees for July 27, I use their games through July 26 and not one pitch more. That's exactly the information I'd have if I were making the bet live.",
      },
      {
        type: "p",
        text: "And I didn't just trust myself to get it right. I wrote a test that actively tries to cheat and confirms it can't. It takes a game, alters data from the future, and checks that none of the model's inputs for that game move. If a game that hasn't happened yet could change a past prediction, the test fails loudly. It passed.",
      },
      {
        type: "p",
        text: "My favorite piece of accidental proof: the model can only correctly predict 18 of the 700 short starts in my data. That sounds bad. It's actually the system working. A model peeking at the future would “predict” all 700 perfectly, because it'd already know they happened. Mine can't foresee an ejection or a blowup. It only knows a pitcher's prior workload, so it flags exactly the handful of recurring openers and nothing else. The model being appropriately unable to see the future is the proof it isn't cheating.",
      },
      {
        type: "p",
        text: "The cheat-test proves the plumbing doesn't leak. The next chart proves the output is honest too: the probabilities coming out the other end mean what they say, on 1,569 holdout games the model never trained on.",
      },
      {
        type: "image",
        src: "/blogs/1/calibration.png",
        alt: "Calibration plot: predicted probability of a total over 8.5 runs against the observed frequency, across ten deciles of the 2026 holdout, tracking the 45-degree diagonal within sampling noise.",
        width: 1200,
        height: 750,
        caption:
          "Ten deciles, one dashed diagonal, no cherry-picking. Sort every 2026 holdout game by the model's predicted P(total > 8.5), split into ten equal-sized bins (about 157 games each), and plot predicted against how often the over actually hit. If the model were fooling itself, whether from leaking, overfitting, or just poor calibration, this would drift off the diagonal, usually toward overconfidence. It doesn't. The points sit on the line within the noise you'd expect from ~157 games a bin, with no systematic bias toward over- or under-confident in either direction.",
      },
      { type: "h2", text: "The plot twist: I was sure it was too cautious" },
      {
        type: "p",
        text: "Some nights, the board looked fuller, closer to the 7.4-to-9.5 spread you saw above. But on plenty of others, every game clustered near the same total: 8.3, 8.7, 9.0, 8.8. Meanwhile a sportsbook posts totals from 6.5 to 11.5 basically every day. Averaged out, my model looked timid, like it was hedging toward league average and never committing to a genuinely high- or low-scoring game.",
      },
      {
        type: "p",
        text: "Obvious fix, right? Loosen it up. Trust the team stats more, pull toward the average less, let the extreme games be extreme.",
      },
      {
        type: "p",
        text: "I built the test to do exactly that: widen the predictions, but only where doing so actually improved the model's honesty (its calibration), so I couldn't just fool myself into confident garbage.",
      },
      {
        type: "p",
        text: "The result blindsided me. Widening the predictions made the model worse. And the home-run component, one of the inputs I was sure needed more freedom, wanted the exact opposite. It asked to be trusted less, not more. (Home runs are rare and lumpy; a few flukey ones in a small sample lie to you, so leaning away from them is what earned the improvement.) When I combined every honest adjustment the data endorsed, the total spread of my predictions went down, not up.",
      },
      {
        type: "p",
        text: "My instinct was wrong, and the data said so in a way I couldn't argue with. The model wasn't too timid. It was about as spread-out as its inputs genuinely justified, and my urge to make it “bolder” was really an urge to make it lie more confidently.",
      },
      {
        type: "p",
        text: "That's the whole game, honestly. The discipline isn't building the model. It's refusing to juice it toward output that looks impressive.",
      },
      { type: "h2", text: "Hitting the wall, and proving it was a wall" },
      {
        type: "p",
        text: "So I ran the honest test. Train on 2023–2025, then predict a season the model had never seen: 2026. And crucially, split by time, never randomly, because a random split would let the model study August to predict July, leaking season-level information and inflating the score. (Same sin as before, wearing a different hat.)",
      },
      {
        type: "p",
        text: "The verdict: against the naive version of itself, my model won clearly, proof the whole machine works. But against the dumbest possible baseline, just guess the league-average total every single game, it was a statistical tie.",
      },
      {
        type: "facts",
        items: [
          ["GLM, off_woba (selected)", "−2.8775"],
          ["Flat league-mean baseline", "−2.8782"],
          ["Naive ratio baseline", "−3.4482"],
        ],
      },
      {
        type: "p",
        muted: true,
        text: "Totals-level log score on the 1,569-game 2026 holdout, where less negative is better. The gap to the flat baseline is 0.0007, on a scale where that's noise, not signal. The gap to the naive baseline is real and isn't close.",
      },
      {
        type: "p",
        text: "I ran the diagnostics every way I could. They all pointed at the same thing: my four features explain roughly 1% of the variance in game totals. Not because the model is broken, but because four team-level numbers are most of what a team-level model can possibly know, and that's near the ~9% ceiling I'd calculated on day one, further eroded by the noise in estimating those numbers from limited games. You can see it in the offense coefficient itself: 1.14, when clean theory says a perfectly-measured offense signal should land somewhere around 1.8–2.3. The model isn't ignoring offense. It's telling you that the offense number it has, estimated from a couple months of games, is too noisy to trust much further than that.",
      },
      {
        type: "p",
        text: "The model didn't fail to reach its ceiling. It reached its ceiling and confirmed the ceiling was real.",
      },
      { type: "h2", text: "What would actually work (and why I haven't built it yet)" },
      {
        type: "p",
        text: "The gap between me and the sportsbook isn't math I got wrong. It's information I don't have.",
      },
      {
        type: "p",
        text: "The book prices things my four features are structurally blind to:",
      },
      {
        type: "list",
        items: [
          "Today's actual lineup: who's playing, who's resting, who got called up. I used team-level averages; they use the nine hitters actually in the box tonight.",
          "Weather: wind at Wrigley moves totals more than most stats people track. A windblown afternoon genuinely projects to 13 runs, and no amount of tuning my existing features gets there, because the wind simply isn't in them.",
          "Umpire: strike-zone tendencies shift run environments by real margins.",
          "Bullpen availability: a great bullpen that threw 40 pitches last night is not a great bullpen tonight.",
        ],
      },
      {
        type: "p",
        text: "Those are where the real extreme games live. That's the sequel. I didn't build it yet because live lineups, weather, and umpire assignments all mean new live data feeds instead of the cached, leakage-safe pipeline I already trust, and I'd rather ship the honest version now and add that surface area for bugs deliberately, later, than rush it in before the plumbing was even proven.",
      },
      { type: "h2", text: "So, did it make my money back?" },
      {
        type: "p",
        text: "No. It told me, with clean math and no excuses, that beating a baseball total with team-level data alone is close to impossible, and it showed me precisely where the missing information lives.",
      },
      {
        type: "p",
        text: "That's worth more than the bets were. I'd probably do it again anyway, next time with a weather feed.",
      },
      { type: "p", text: "A few more things, if you want them:" },
      {
        type: "links",
        items: [
          ["Code", "https://github.com/dkyxhjj/mlb_predictor"],
          ["Live dashboard", "https://mlb-predictor.pages.dev/"],
          ["Argue with me about the home-run term", "mailto:richardli.060411@gmail.com"],
        ],
      },
      {
        type: "p",
        muted: true,
        text: "Built with Python, statsmodels, and pybaseball for the model; Vite, React, TypeScript, and Tailwind for the dashboard, deployed on Cloudflare Pages.",
      },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatPostDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
