#ifndef COCKTAIL_MODEL_HPP
#define COCKTAIL_MODEL_HPP
#include <string>
#include <vector>
struct Ingredient { std::string name; int ml; };
struct Cocktail {
  std::string name;
  std::vector<Ingredient> alcohols;
  std::string bitters;  // "none" | "angostura bitters" | "orange bitters" | "peychaud’s bitters"
  int dashes;
  std::string method;   // "shaken" | "stirred"
  std::string strain;   // "single" | "double"
  std::string ice;      // "none" | "regular" | "crushed" | "large"
  std::vector<std::string> garnish;
  bool skipGarnishCheck{false};
};
#endif