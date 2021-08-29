#include "utils.h"

vector<float> parse_float_vector(string parsefrom){
    vector<float> values;
    stringstream ss_sentance;
    ss_sentance << parsefrom;
    float possible_number;
    string couple_of_words;
    while (!ss_sentance.eof()){
        ss_sentance >> couple_of_words;
        stringstream ss_word;
        ss_word << couple_of_words;
        string a_word;
        while(ss_word.good()){
            getline(ss_word, a_word, ',');
            values.push_back(std::stof(a_word));
        }
    }
    return values;
}

float parse_float_number(string parsefrom){
    stringstream ss_sentance;
    ss_sentance << parsefrom;
    float possible_number;
    string couple_of_words;
    while (!ss_sentance.eof()){
        ss_sentance >> couple_of_words;
        stringstream ss_word;
        ss_word << couple_of_words;
        string a_word;
        while(ss_word.good()){
            getline(ss_word, a_word, ',');
            return std::stof(a_word);
        }
    }
    return 0;
}

Point parse_point_2D(string parasefrom){
    Point p;
    vector<float> v = parse_float_vector(parasefrom);
    int i = 0;
    if (v.size() > 2){
        cout << "\nWarning: More than required parameters provided to the input " <<parasefrom << "!\nRequired : 2, Provided : " << v.size()
        << "\n         Using the only first 2 values for calculations ";
    }
    for (vector<float>::iterator ptr = v.begin(); ptr < v.begin() +2; ptr++){
        p[i] = *ptr;
        i++;
    } 
    return p;
}