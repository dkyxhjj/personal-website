# I Built a Model to Beat Baseball. It Taught Me Why I Couldn't.

*[TODO: swap in your own subtitle. Something like: "670,000 plate appearances, a negative binomial, and the most useful failure I've shipped."]*

---

I lost money betting on baseball.

Not a catastrophic amount — [TODO: your real detail here, or cut this line. A specific, self-deprecating number lands better than "some money." e.g. "enough that I stopped telling my roommates about it"]. But enough that the stubborn part of my brain refused to let it go. I don't hate losing money. I hate losing money to *randomness I could have modeled*. So I did the thing every stats undergrad does when they get annoyed: I decided to build a model.

The plan was simple. Predict the total runs in a game better than the sportsbook, find the gaps, print money. You can already tell from the title how that went.

Here's what actually happened, why it's more interesting than a win would have been, and everything I'd tell you if you were about to try the same thing.

![The dashboard's slate view: a list of the day's games, each with a projected score, a projected total with a plus-or-minus, and a small distribution shape. Totals range from 7.4 for Brewers-Giants to 9.5 for Blue Jays-Nationals.](TODO-slate-view.png)

*The tool I ended up with: every game on the day's board, each with a projected total and the full shape of possible outcomes. Note the spread here — 7.4 up to 9.5. It varies night to night; this is a fuller slate than some, and on tighter nights the games bunch up much closer together, which turned out to matter more than I expected. More on that later.*

[TODO: replace the image path with your slate screenshot filename.]

---

## The number nobody wants to hear first

Before I wrote a line of modeling code, I did one calculation that should have talked me out of the whole project — and that I'm now glad I ran, because it reframed everything.

**How predictable is a baseball game, at best?**

I simulated it. Take realistic spreads for how much teams differ in offense, pitching, and ballpark, and ask: if you knew all of that *perfectly*, how much of a game's final total could you explain? The answer is about **9%**.

Ninety-one percent of a baseball game is noise. Bloops that fall in. Rockets hit straight at fielders. A checked-swing single in the ninth. The stuff no model can touch because it isn't a function of anything knowable beforehand.

That number does something important: it changes what "good" means. If you chase point-accuracy — "the total will be 8.7" — you will look like a failure no matter how good your model is, because you'll be off by three runs on average and so will God's own model. So I stopped trying to predict the score. I aimed for something achievable instead: **calibration**. When my model says there's a 60% chance the game goes over 8.5, it should go over about 60% of the time. You can't predict the score. You *can* predict the odds.

That reframe is the single most useful thing in this whole post. Hold onto it.

![Total runs distribution for Phillies at Marlins: a right-skewed curve peaking around 6-7 runs, with P(total >= 7) = 60%, P(>= 8) = 50%, P(>= 9) = 40%, P(>= 10) = 32%, P(>= 11) = 25%. Win probability PHI 58% / MIA 42%.](TODO-game-view.png)

*This is what the model actually produces — not a number, a **shape**. Phillies at Marlins, projected total 8.0. But look where the curve peaks: around 6 or 7, not 8. Run scoring is lopsided — a handful of blowouts drag the average up above where most games actually land, so the most likely single outcome sits below the "projected" total. That's why the model reads out probabilities (60% chance of 7+ runs, 25% chance of 11+) instead of one confident guess. A single number would hide the entire story this curve is telling.*

[TODO: replace the image path with your screenshot filename. This is your best visual — most readers have never seen a probability distribution over a baseball score.]

---

## What the model actually looks at

A baseball game's run total comes down to a small number of things, and I wanted the model to use the *honest* versions of each.

**How well a team hits — but measured by process, not luck.** The naive move is to rate offense by runs scored. The problem: runs are contaminated by sequencing and luck. Three singles in one inning score a run; the same three singles spread across three innings score nothing. A 105-mph line drive right at the shortstop is an out; a 60-mph bloop that drops is a hit. Runs reward the bloop and punish the rocket, which is exactly backwards if you're trying to predict the *future*.

So instead of runs, the model uses **xwOBA** — expected weighted on-base average. It grades each plate appearance by how hard and at what angle the ball was hit, then asks how often balls hit like that become hits historically. The rocket-at-the-shortstop gets credited as the good swing it was. The lucky bloop gets little. It measures what a team *did*, stripped of what luck *did to them* — and it predicts future scoring better than past scoring does.

**The pitching — starter and bullpen, separately.** Rated by FIP, which is built only from what a pitcher controls (strikeouts, walks, home runs) and ignores the defense behind him. Starter and bullpen are split apart and weighted by how long the starter is expected to last, because "the pitching" is really two different pitching staffs having two different nights.

**The ballpark.** Coors Field inflates scoring ~13%; pitcher-friendly parks knock it down. A simple multiplier.

**The era.** Leaguewide scoring drifts season to season — the ball itself changes. A running league-average term keeps the model anchored to the current run environment instead of assuming baseball scores the same forever.

![The deployed model's coefficients: intercept 1.29, log(offense) 1.14, starter 0.90, bullpen 1.21, park 0.81, home 0.002, dispersion k=3.53, trained on 14,544 team-games from 2023-25.](TODO-model-view.png)

*The coefficients, straight from the live dashboard. Each one is a **shrinkage factor** — how much of a feature's nominal signal actually survives into runs. Offense (b1) comes out at **1.14**: a team's recent hitting matters, but nothing like face value, because recent stats overstate true talent. The home-field term (b5) lands at essentially **zero** — real home advantage almost exactly cancels the fact that home teams skip the bottom of the ninth when they're already winning. And note the footnote in the corner: this model was picked by its score on a **held-out season**, not by how well it fit the data it trained on. Selecting on in-sample fit is another quiet way to fool yourself, and it's the kind of thing you have to decide up front to avoid.*

[TODO: replace the image path above with your actual screenshot filename once you upload it to your blog.]

---

## The part that separates real models from fake ones

Here's where most "I beat Vegas" projects quietly fall apart, and where I spent the majority of my effort.

**You are not allowed to use the future.**

It sounds obvious. It is not obvious in practice, because the trap is invisible. A team's season-long xwOBA is sitting right there in the data — it's the natural number to grab. But if I use the Yankees' *full-2026* xwOBA to predict their game on July 27, I've cheated: that season average already contains July 27, and every game after it. I'd be using the answer to predict the answer.

This is called **data leakage**, and it's the number one way sports and finance modelers fool *themselves*. Nothing errors out. The code runs clean. The model produces gorgeous accuracy — and then falls apart the instant you point it at a genuinely upcoming game, because for a real future game, that "future" data doesn't exist yet.

So every single input in my model is computed using **only games played before the one being predicted**. To rate the Yankees for July 27, I use their games through July 26 and not one pitch more. That's exactly the information I'd have if I were making the bet live.

And I didn't just trust myself to get it right — I wrote a test that *actively tries to cheat and confirms it can't*. It takes a game, alters data from the future, and checks that none of the model's inputs for that game move. If a game that hasn't happened yet could change a past prediction, the test fails loudly. It passed.

My favorite piece of accidental proof: the model can only correctly predict *18* of the 700 short starts in my data. That sounds bad. It's actually the system working. A model peeking at the future would "predict" all 700 perfectly, because it'd already know they happened. Mine can't foresee an ejection or a blowup — it only knows a pitcher's prior workload — so it flags exactly the handful of *recurring* openers and nothing else. The model being appropriately *unable* to see the future is the proof it isn't cheating.

*[TODO: this section is the most valuable part of the post for a technical audience. If you have a screenshot of the perturbation test or the calibration plot, put it here. The calibration-plot-tracking-the-diagonal is your single most credible image.]*

---

## The plot twist: I was sure it was too cautious

Some nights, the board looked fuller — the 7.4-to-9.5 spread you saw above. But on plenty of others, every game clustered near the same total: 8.3, 8.7, 9.0, 8.8. Meanwhile a sportsbook posts totals from 6.5 to 11.5 basically every day. Averaged out, my model looked *timid* — like it was hedging toward league average and never committing to a genuinely high- or low-scoring game.

Obvious fix, right? Loosen it up. Trust the team stats more, pull toward the average less, let the extreme games be extreme.

I built the test to do exactly that — widen the predictions, but *only* where doing so actually improved the model's honesty (its calibration), so I couldn't just fool myself into confident garbage.

The result blindsided me. **Widening the predictions made the model worse.** And the home-run component — one of the inputs I was sure needed *more* freedom — wanted the exact opposite. It asked to be trusted *less*, not more. (Home runs are rare and lumpy; a few flukey ones in a small sample lie to you, so leaning away from them is what earned the improvement.) When I combined every honest adjustment the data endorsed, the total spread of my predictions went *down*, not up.

My instinct was wrong, and the data said so in a way I couldn't argue with. The model wasn't too timid. It was about as spread-out as its inputs genuinely justified — and my urge to make it "bolder" was really an urge to make it *lie more confidently*.

That's the whole game, honestly. The discipline isn't building the model. It's refusing to juice it toward output that looks impressive.

---

## Hitting the wall — and proving it was a wall

So I ran the honest test. Train on 2023–2025, then predict a season the model had never seen: 2026. And crucially, split by *time*, never randomly — because a random split would let the model study August to predict July, leaking season-level information and inflating the score. (Same sin as before, wearing a different hat.)

The verdict: against the naive version of itself, my model won clearly — proof the whole machine works. But against the dumbest possible baseline, *just guess the league-average total every single game*, it was **a statistical tie.**

I ran the diagnostics every way I could. They all pointed at the same thing: my four features explain roughly **1%** of the variance in game totals. Not because the model is broken — because four team-level numbers are *most of what a team-level model can possibly know*, and that's near the ~9% ceiling I'd calculated on day one, further eroded by the noise in estimating those numbers from limited games. You can see it in the offense coefficient itself: 1.14, when clean theory says a perfectly-measured offense signal should land somewhere around 1.8–2.3. The model isn't ignoring offense — it's telling you that the offense number it *has*, estimated from a couple months of games, is too noisy to trust much further than that.

The model didn't fail to reach its ceiling. It reached its ceiling and confirmed the ceiling was real.

*[TODO: the predicted-vs-actual scatter with R²≈0.01 belongs here. It's the honest gut-punch image. Let it be ugly — that's the point.]*

---

## What would actually work (and why I didn't do it — yet)

The gap between me and the sportsbook isn't math I got wrong. It's **information I don't have.**

The book prices things my four features are structurally blind to:

- **Today's actual lineup** — who's playing, who's resting, who got called up. I used team-level averages; they use the nine hitters actually in the box tonight.
- **Weather** — wind at Wrigley moves totals more than most stats people track. A windblown afternoon genuinely projects to 13 runs, and no amount of tuning my existing features gets there, because the wind simply isn't *in* them.
- **Umpire** — strike-zone tendencies shift run environments by real margins.
- **Bullpen availability** — a great bullpen that threw 40 pitches last night is not a great bullpen tonight.

Those are where the real extreme games live. That's the sequel. I didn't build it yet because [TODO: your real reason — "it's a much bigger data-engineering lift and I wanted to ship the honest version first," or whatever's true for you].

---

## What I'd tell you if you were about to do this

*[TODO: this is the section recruiters and other builders actually read. Make it yours — these are my defaults, cut or rewrite freely.]*

1. **Calculate your ceiling before you write the model.** Ten minutes of "how predictable is this even, at best?" will save you months of chasing accuracy that physically doesn't exist.

2. **The features are the model. The fit is a footnote.** The actual training took seconds. Every decision that mattered — leakage, which stat, how much to trust it — happened before the optimizer ran. If your inputs peeked at the future, a beautiful fit just launders the cheating.

3. **Write the test that tries to cheat.** Don't trust yourself to have avoided leakage. Build the thing that actively attempts it and proves it failed. It's the difference between hoping and knowing.

4. **When your instinct says "make it bolder," get suspicious.** Bolder-and-wrong is worse than timid-and-honest. Widen predictions only where a real metric says you've earned it — and be ready for the data to tell you you're wrong, like it told me.

5. **A negative result you can trust beats a positive one you can't.** My model ties a coin flip. But it ties a coin flip *honestly* — no leakage, no juicing, and I can prove exactly why. Most people who build these never find out their model is at the ceiling, because they're too busy accidentally cheating to notice.

---

## So, did it make my money back?

No. It told me, with clean math and no excuses, that beating a baseball total with team-level data alone is close to impossible — and it showed me precisely where the missing information lives.

That's worth more than the bets were. [TODO: your closing line. Something personal. The best version of this admits you'd probably do it again anyway.]

---

*The code is at [TODO: your repo link]. The live dashboard is at [TODO: link once it's deployed]. If you want to argue with me about whether the home-run term should really shrink that hard, [TODO: your handle / how to reach you] — I'd genuinely enjoy it.*

*[TODO: consider a one-line "built with" footer — Python, statsmodels, pybaseball / MLB Statcast, React. Signals the stack without cluttering the body.]*
