#ifndef COCKTAIL_LIST_HPP
#define COCKTAIL_LIST_HPP
#include <vector>
#include <utility>
#include "model.hpp"

inline void seed_db(std::vector<Cocktail>& DB){
  if (!DB.empty()) return;
  auto push = [&](Cocktail c){ DB.push_back(std::move(c)); };

   // --- TOP 60 COCKTAILS (data only) ---
  push({"ESPRESSO MARTINI", {{"Wyborowa Vodka",30},{"Tia Maria",30},{"Little Dripper",30}},
        "none",0,"shaken","double","none",{"grated chocolate","three coffee beans","3 coffee beans"},false});

  push({"NEGRONI", {{"Beefeater Gin",30},{"Campari",30},{"Rosso Antico Sweet Vermouth",30}},
        "none",0,"stirred","single","large",{"orange peel","orange twist"},false});

  push({"MARGARITA", {{"Olmeca Plata",45},{"Cointreau",15}},
        "none",0,"shaken","single","regular",{"lime wheel","no garnish","none"},false});

  push({"AMARETTO SOUR", {{"Disaronno Amaretto",60}},
        "none",0,"shaken","double","regular",{"2 cherries on a skewer","two cherries on a skewer","2 cherries"},false});

  push({"PORN STAR MARTINI", {{"Absolut Vanilla Vodka",30},{"Passoa Passion Liqueur",30},{"Prosecco",45}},
        "none",0,"shaken","double","none",{"1/2 passionfruit","half passionfruit","passionfruit half"},false});

  push({"OLD FASHIONED", {{"Buffalo trace",60}},
        "angostura bitters",3,"stirred","single","large",{"orange twist","orange peel"},false});

  push({"MARTINI", {{"Vodka or Gin",60},{"Maidenii Dry Vermouth",15}},
        "none",0,"stirred","single","none",{"2 x olive on skewer","olive","lemon twist"},false});

  push({"SPICY MARGARITA", {{"Altos Reposado",60}},
        "none",0,"shaken","single","regular",{"jalapeno wheel and lime wheel","jalapeno and lime wheel"},false});

  // Spritz = build + N/A strain
  push({"APEROL SPRITZ", {{"Aperol",30},{"Prosecco",60}},
        "none",0,"build","na","regular",{"orange wedge"},false});

  push({"WHISKY SOUR", {{"Ballantines Scotch",60}},
        "none",0,"shaken","double","none",{"bitters hearts"},false});

  push({"TOMMY’S MARGARITA", {{"Olmeca Reposado",60}},
        "none",0,"shaken","double","large",{"lime wheel"},false});

  push({"LYCHEE MARTINI", {{"Beefeater Gin",20},{"Soho Lychee",20},{"Rockbare Riesling",20}},
        "none",0,"shaken","double","none",{"lychee on skewer","lychee"},false});

  push({"LONG ISLAND ICED TEA", {{"Wyborowa Vodka",15},{"Beefeater Gin",15},{"Havana Club 3 Y/O Anos",15},{"Olmeca Plata",15},{"Cointreau",15}},
        "none",0,"shaken","single","regular",{"lemon wedge"},false});

  push({"COSMOPOLITAN", {{"Absolut Citron Vodka",45},{"Cointreau",15}},
        "none",0,"shaken","double","none",{"flamed orange coin","orange coin"},false});

  push({"SOUTHSIDE", {{"Beefeater Gin",60}},
        "none",0,"shaken","double","none",{"mint leaf"},false});

  // Mojito = build + N/A + crushed
  push({"MOJITO", {{"Havana Club 3 Y/O Anos",60}},
        "none",0,"build","na","crushed",{"mint sprig"},false});

  // Piña Colada = shaken + dump over crushed
  push({"PINA COLADA", {{"Havana Especial",60}},
        "none",0,"shaken","dump","crushed",{"2 pineapple fronds","two pineapple fronds"},false});

  // Moscow Mule = build + N/A + crushed
  push({"MOSCOW MULE", {{"Wyborowa Vodka",60}},
        "none",0,"build","na","crushed",{"mint sprig"},false});

  push({"FRENCH MARTINI", {{"Wyborowa Vodka",30},{"Chambord",30}},
        "none",0,"shaken","double","none",{"none"},false});

  push({"CHARLIE CHAPLAN", {{"Joseph Cartron Apricot Brandy",30},{"Plymouth Sloe Gin",30}},
        "none",0,"shaken","double","none",{"lime bow"},false});

  push({"CLOVER CLUB", {{"Beefeater Gin",45},{"Maidenii Dry Vermouth",15}},
        "none",0,"shaken","double","none",{"three raspberries on a skewer","3 raspberries on a skewer"},false});

  push({"JAPANESE SLIPPER", {{"Midori",30},{"Cointreau",30}},
        "none",0,"shaken","double","none",{"maraschino cherry"},false});

  push({"MANHATTAN", {{"Woodford Reserve",45},{"Rosso Antico Sweet vermouth",15}},
        "angostura bitters",2,"stirred","single","none",{"maraschino cherry"},false});

  // Painkiller = shaken + dump over crushed
  push({"PAINKILLER", {{"Havana Especial Rum",60}},
        "none",0,"shaken","dump","crushed",{"grated nutmeg","nutmeg"},false});

  // Paloma = build + N/A
  push({"PALOMA", {{"Olmeca Plata",45}},
        "none",0,"build","na","regular",{"tajin rim"},false});

  push({"CORPSE REVIVER #2", {{"Beefeater Gin",20},{"Lillet Blanc",20},{"Cointreau",20}},
        "none",0,"shaken","double","none",{"lemon twist"},false});

  push({"SLOE GIN SOUR", {{"Plymouth Sloe Gin",60}},
        "none",0,"shaken","double","none",{"none"},false});

  push({"NAKED & FAMOUS", {{"Vida Mezcal",20},{"Yellow Chartreuse",20},{"Aperol",20}},
        "none",0,"shaken","double","none",{"thyme sprig"},false});

  // Mai Tai = shaken + dump over crushed
  push({"MAI TAI", {{"Havana Especial Rum",45},{"Cointreau",15}},
        "none",0,"shaken","dump","crushed",{"lime wheel","mint sprig"},false});

  // Missionary’s Downfall = shaken + dump over crushed
  push({"MISSIONARY’S DOWNFALL", {{"Havana Club 3 Y/O Anos",30},{"Peach Schnapps",15}},
        "none",0,"shaken","dump","crushed",{"mint sprig"},false});

  // Dark & Stormy = build + N/A
  push({"DARK AND STORMY", {{"Goslings Black Seal Rum",45}},
        "none",0,"build","na","regular",{"mint sprig"},false});

  push({"SINGAPORE SLING", {{"Beefeater Gin",45},{"Cherry Heering",15},{"Cointreau",7},{"Dom Benedictine",7}},
        "angostura bitters",1,"shaken","single","regular",{"cherry and orange slice","orange slice and cherry"},false});

  push({"PENICILLIN", {{"Naked Grouse Whisky",45},{"Ardbeg 10 Y/O",5}},
        "none",0,"shaken","double","large",{"candied ginger on skewer","candied ginger"},false});

  push({"NUCLEAR SOUR", {{"Jim Beam Rye",25},{"Yellow Chartreuse",25},{"Falernum",10},{"Red Wine",15}},
        "none",0,"shaken","double","large",{"red wine float"},false});

  push({"GRASSHOPPER", {{"Crème de Menthe",30},{"Josph Cartron White Crème de Cacao",30}},
        "none",0,"shaken","double","none",{"mint leaf","grated chocolate"},false});

  push({"FRENCH 75", {{"Beefeater Gin",20},{"Chandon Brut",75}},
        "none",0,"shaken","double","none",{"lemon bow"},false});

  // Pi Yi = shaken + dump over crushed
  push({"PI YI", {{"Havana Club 3 Y/O Anos",30},{"Havana Especial Rum",20}},
        "angostura bitters",1,"shaken","dump","crushed",{"2 pineapple leaves","two pineapple leaves"},false});

  // Limoncello Spritz = build + N/A
  push({"LIMONCELLO SPRITZ", {{"Villa Massa Limoncello",30},{"Prosecco",60}},
        "none",0,"build","na","regular",{"lemon slice"},false});

  // Black & White Russian = build + N/A
  push({"BLACK & WHITE RUSSIAN", {{"Kahlua",30},{"Wyborowa Vodka",30}},
        "none",0,"build","na","regular",{"none"},false});

  push({"DAIQUIRI", {{"Havana Club 3 Y/O Anos",60}},
        "none",0,"shaken","double","none",{"lime twist"},false});

  push({"DAIQUIRI (HEMINGWAY)", {{"Havana Club 3 Y/O Anos",50},{"Luxardo Maraschino",10}},
      "none",0,"shaken","double","none",{"lime twist"},false});

  push({"LAST WORD", {{"Beefeater Gin",20},{"Green Chartreuse",20},{"Luxardo Maraschino",20}},
        "none",0,"shaken","double","none",{"maraschino cherry"},false});

  push({"BRAMBLE", {{"Beefeater Gin",50},{"Chambord",10}},
        "none",0,"shaken","single","crushed",{"chambord drizzle","measure and pour 10ml chambord"},false});

  // Bloody Mary = build + N/A (garnish varies)
  push({"BLOODY MARY", {{"Wyborowa Vodka",60}},
        "none",0,"build","na","regular",{"varies"},true});

  push({"GIMLET", {{"Beefeater Gin",60}},
        "none",0,"shaken","double","none",{"lime twist"},false});

  push({"GIN FIZZ", {{"Beefeater Gin",60}},
        "none",0,"shaken","double","none",{"none"},false});

  push({"NEW YORK SOUR", {{"Jim Beam Rye",60},{"House Red wine",30}},
        "none",0,"shaken","double","large",{"float red wine","red wine float"},false});

  push({"PISCO SOUR", {{"Pancho Pisco",60}},
        "none",0,"shaken","double","none",{"bitters hearts"},false});

  push({"AVIATION", {{"Beefeater Gin",50},{"Luxardo Maraschino",10},{"Tempus Fugit Liqueur de Violettes",10}},
        "none",0,"shaken","double","none",{"maraschino cherry"},false});

  // Zombie = shaken + dump over crushed
  push({"ZOMBIE", {{"Havana Club 3 Y/O Anos",15},{"Havana Club Especial Rum",15},{"Goslings Black Seal Rum",15},{"Joseph Cartron Apricot Brandy",15},{"green chartreuse",15},{"Falernum",7}},
        "none",0,"shaken","dump","crushed",{"flaming citrus shell","half passionfruit or lime shell with flame"},false});

  push({"BOULEVARDIER", {{"Jim Beam Rye",40},{"Campari",20},{"Rosso Antico Sweet vermouth",20}},
        "none",0,"stirred","single","large",{"orange twist"},false});

  // Caipirinha = build + N/A + crushed
  push({"CAIPIRINHA", {{"Sagatiba Cachaca",60}},
        "none",0,"build","na","crushed",{"lime wedge"},false});

  push({"TOM COLLINS", {{"Beefeater Gin",60}},
        "none",0,"shaken","single","regular",{"lemon wedge"},false});

  push({"LOST WORD", {{"Martell VS Cognac",20},{"Yellow Chartreuse",20},{"Luxardo Maraschino",20}},
        "none",0,"shaken","double","none",{"maraschino cherry"},false});

  push({"RUSTY NAIL", {{"Glenmorangie Original 10 Y/O",40},{"Drambuie",20}},
        "none",0,"stirred","single","large",{"lemon twist"},false});

  push({"JAPANESE STRIPPER", {{"Midori",30},{"Licor 43",30}},
        "none",0,"shaken","double","none",{"maraschino cherry"},false});

  // Caprioska = build + N/A + crushed
  push({"CAPRIOSKA", {{"Wyborowa Vodka",60}},
        "none",0,"build","na","crushed",{"lime wedge"},false});

  // Your spec lists Bijou as shaken; keep as-is
  push({"BIJOU", {{"Beefeater Gin",30},{"Rosso Antico Sweet vermouth",15},{"Green Chartreuse",15}},
        "orange bitters",2,"shaken","single","none",{"orange twist"},false});

  push({"SAZERAC (Original)", {{"Jim Beam Rye",60}},
        "peychaud’s bitters",3,"stirred","single","none",{"lemon twist"},false});

  push({"SAZERAC (New Orleans)", {{"Martel VS Cognac",60}},
        "peychaud’s bitters",3,"stirred","single","none",{"lemon twist"},false});

  push({"SAZERAC (New York)", {{"Jim Beam Rye",30},{"Martel VS Cognac",30}},
        "peychaud’s bitters",3,"stirred","single","none",{"lemon twist"},false});

  // Elderflower Spritz = build + N/A
  push({"ELDERFLOWER SPRITZ", {{"Fiorente Elderflower",30},{"Prosecco",60}},
        "none",0,"build","na","regular",{"lemon slice"},false});

  push({"SIDECAR", {{"Martel VS Cognac",45},{"Cointreau",15}},
        "none",0,"shaken","double","none",{"lemon twist"},false});
}
#endif