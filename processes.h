#include "cpp_modules/dist/json/json.h"
#include "cpp_modules/utils.h"
#ifndef INCLUDE_PRIMEORDEAL_GEOMETRY
    #include "cpp_modules/primeordeal/geometry.h"
#endif


using namespace std;

typedef Json::Value json;

Point read_int(string word);
void draw_contour(json process_request);
void update_displacement_field(json process_request);
void draw_line(map<string, string> data);