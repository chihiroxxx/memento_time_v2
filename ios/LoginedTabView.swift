//
//  LoginedTabView.swift
//  memento_app
//
//  Created by 小林千紘 on 2021/09/28.
//

import SwiftUI


struct LoginedTabView: View {

    var body: some View {
            TabView{
                SearchView()
                    .tabItem {
                                        Text("Search")

                    }
                IndexView()
                    .tabItem {
                        Text("Index")
                    }
                CollectionView()
                    .tabItem {
                        Text("Collection")
                    }

            }
            }
    }


struct LoginedTabView_Previews: PreviewProvider {
    static var previews: some View {
        LoginedTabView()
    }
}
