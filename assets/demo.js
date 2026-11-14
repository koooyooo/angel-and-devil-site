// Step-through banter demo that mimics the plugin's modal: click / Space reveals the next line, the speaker's
// card lights up ("Speaking"), the other dims ("Standby"), and the speed-line burst moves to the speaker.
// Lines come from <template id="demo-lines"> (one <p data-who="angel|devil"> per turn).
(function () {
  var root = document.getElementById("demo");
  var tpl = document.getElementById("demo-lines");
  if (!root || !tpl) return;

  var lines = Array.prototype.slice.call(tpl.content.querySelectorAll("p"));
  var stage = root.querySelector(".aad-stage");
  var log = root.querySelector(".aad-log");
  var chars = { angel: root.querySelector(".aad-char.is-angel"), devil: root.querySelector(".aad-char.is-devil") };
  var names = { angel: chars.angel.querySelector(".aad-char-name").textContent, devil: chars.devil.querySelector(".aad-char-name").textContent };
  var labels = { speaking: root.getAttribute("data-speaking"), standby: root.getAttribute("data-standby") };
  var nextBtn = root.querySelector("[data-act=next]");
  var allBtn = root.querySelector("[data-act=all]");
  var resetBtn = root.querySelector("[data-act=reset]");
  var shown = 0;

  function setSpeaker(who) {
    ["angel", "devil"].forEach(function (k) {
      var on = k === who;
      chars[k].classList.toggle("is-speaking", on);
      chars[k].querySelector(".aad-char-status").textContent = on ? labels.speaking : labels.standby;
    });
    stage.classList.toggle("burst-devil", who === "devil");
  }

  function render(p, animate) {
    var who = p.getAttribute("data-who");
    var prev = log.querySelector(".aad-bubble.is-current");
    if (prev) prev.classList.remove("is-current");
    var bubble = document.createElement("div");
    bubble.className = "aad-bubble is-" + who + (animate ? " is-current" : "");
    var plate = document.createElement("div");
    plate.className = "aad-nameplate";
    plate.textContent = names[who];
    var body = document.createElement("div");
    body.className = "aad-bubble-body";
    body.textContent = p.textContent.trim();
    bubble.appendChild(plate);
    bubble.appendChild(body);
    log.appendChild(bubble);
    setSpeaker(who);
    return bubble;
  }

  function scrollToEnd() { log.scrollTop = log.scrollHeight; }

  function update() {
    var done = shown >= lines.length;
    nextBtn.disabled = done;
    allBtn.disabled = done;
  }

  function next() {
    if (shown >= lines.length) return;
    render(lines[shown++], true);
    scrollToEnd();
    update();
  }

  nextBtn.addEventListener("click", next);
  allBtn.addEventListener("click", function () {
    var last;
    while (shown < lines.length) last = render(lines[shown++], false);
    if (last) last.classList.add("is-current");
    scrollToEnd();
    update();
  });
  resetBtn.addEventListener("click", function () { log.innerHTML = ""; shown = 0; next(); });
  log.addEventListener("click", next);
  root.addEventListener("keydown", function (e) {
    if (e.target.tagName === "AUDIO" || e.target.tagName === "BUTTON" || e.target.tagName === "A") return;
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); next(); }
  });

  next();
})();
