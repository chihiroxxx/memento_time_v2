//
//  IndexView.swift
//  memento_app
//
//  Created by 小林千紘 on 2021/09/25.
//

import SwiftUI

struct IndexView: View {
    @ObservedObject var indexCardData = IndexCardData()

    var body: some View {
        VStack{
            Text("index画面！！！")
            Button(action: {
                indexCardData.getIndexCard()
            }){
                Text("reload index")
            }
            VStack{
                ScrollView(showsIndicators: false){
                    LazyVStack {
                        ForEach(indexCardData.indexCardArr){
                            thought in
                            IndexCardItem(indexCard: thought)
                            }
                    }
                }
            }
        }.onAppear(perform: {
            if indexCardData.indexCardArr.count == 0 {
                indexCardData.getIndexCard()
            }
        })
    }
}

struct IndexView_Previews: PreviewProvider {
    static var previews: some View {
        IndexView()

    }
}
