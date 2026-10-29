#include<iostream>
using namespace std;

int main(){
    int marks[4]={77,65,71,90,};
    int*p=marks;
    cout<<marks[3]<<endl;
    cout<<marks[2]<<endl;
    cout<<&p[1]<<endl;
    cout<<*p;
    

    return 0;
}