//
//  SearchView.swift
//  memento_app
//
//  Created by 小林千紘 on 2021/09/26.
//

import SwiftUI



struct SearchView: View {
    @ObservedObject var bookSearchDataTstayaList = BookSearchData(urlEndpoint: "tsutaya")
    @ObservedObject var bookSearchDataKinoList = BookSearchData(urlEndpoint: "kino")
    @ObservedObject var bookSearchDataGoogleList = BookSearchDataGoogle(urlEndpoint: "")
    @ObservedObject var bookSearchDataRakutenList = BookSearchDataRakuten(urlEndpoint: "")
    @State var inputText = ""
    @State var showSafari = false

    @State var isShowModal = false
    var body: some View {
        NavigationView {

            VStack{
            HStack{


                TextField("検索したいタイトルを入力！",text: $inputText, onCommit: {
                    inputTextArrange()
                })
                .autocapitalization(.none)
                .padding()
                .border(Color.gray)


                Button(action: {
                    inputTextArrange()
                    UIApplication.shared.closeKeyboard()
                }){
                    Text("検索！")

                }
                Button(action: {
                    inputTextDelete()
                }){
                    Text("リセット！")
                }
            }

            .padding()

            TabView{
//                Tab1
                VStack{
                    SearchListView(bookSearchList: bookSearchDataTstayaList.bookSearchList,
                                   bookShopName: "TSUTAYA")
                }
//                Tab2
                VStack{
                    SearchListView(bookSearchList: bookSearchDataKinoList.bookSearchList,
                                   bookShopName: "紀伊國屋")
                }
//                Tab3
                VStack{
                    SearchListView(bookSearchList: bookSearchDataGoogleList.bookSearchList,
                                   bookShopName: "Google")
                }
//                Tab4
                VStack{
                    SearchListView(bookSearchList: bookSearchDataRakutenList.bookSearchList,
                                   bookShopName: "Rakuten")
                }
            }
            .tabViewStyle(PageTabViewStyle())


        }.navigationBarTitle("", displayMode: .inline)
        .navigationBarHidden(true)
   }
    }

    func inputTextArrange(){
        bookSearchDataTstayaList.searchBook(keyword: inputText)
        bookSearchDataKinoList.searchBook(keyword: inputText)
        bookSearchDataGoogleList.searchBook(keyword: inputText)
        bookSearchDataRakutenList.searchBook(keyword: inputText)
    }

    func inputTextDelete(){
        bookSearchDataTstayaList.resetBook()
        bookSearchDataKinoList.resetBook()
        bookSearchDataGoogleList.resetBook()
        bookSearchDataRakutenList.resetBook()
        inputText = ""
    }
}

struct SearchView_Previews: PreviewProvider {
    static var previews: some View {
        SearchView()
    }
}

extension UIApplication {
    func closeKeyboard() {
        sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
    }
}
