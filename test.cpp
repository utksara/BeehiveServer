#include "cpp_modules/primeordeal/geometry.h"

using namespace std;

void ring_test(){
    vector<int> testvec = {0,1,2,3,4,5,6};
    Ringu <int> r(testvec);

    for (int i = -100; i < 100 ; i++){
        if (i < 0 && r[i] != 6 +  i % 7){
            cout << "\nFalse result : expected value is "<<6 +  i % 7 << ", actual value is "<<r[i];
            exit(0);;
        }
        if (i > 0 && r[i] != i % 7){
            cout << "\nFalse result : expected value is "<<i % 7 << ", actual value is "<<r[i];
            exit(0);
        }
    }
    cout << "\nTest passed successfully";
}

int main(){
    ring_test();
}