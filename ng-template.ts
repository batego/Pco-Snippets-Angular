<div id="tabsimulator" *transloco="let t">
  <div class="">
    <p-tabView (onChange)="onTabChange()">
      <p-tabPanel [header]="t('accumulationAndRedemption.home.onlyMoney')">
        <div class="flex mb-6">
          <div class="text-sm font-bold">{{ t("accumulationAndRedemption.home.onlyMoneyLabel") }}</div>
        </div>
        <ng-container [ngTemplateOutlet]="purchase" [ngTemplateOutletContext]="{ type: 'CASH' }"></ng-container>
      </p-tabPanel>
      <p-tabPanel [header]="t('accumulationAndRedemption.home.onlyPoints')">
        <div class="flex mb-6">
          <div class="text-sm font-bold">{{ t("accumulationAndRedemption.home.onlyPointsLabel") }}</div>
        </div>
        <ng-container [ngTemplateOutlet]="purchase" [ngTemplateOutletContext]="{ type: 'ONLY_POINTS' }"></ng-container>
      </p-tabPanel>
      <p-tabPanel [header]="t('accumulationAndRedemption.home.pointsMoney')">
        <div class="flex mb-6">
          <div class="text-sm font-bold">{{ t("accumulationAndRedemption.home.pointsMoneyLabel") }}</div>
        </div>
        <small>{{ t("accumulationAndRedemption.home.purchaseValue") }}</small>
        <div class="paymentAmount flex flex-col md:flex-row mt-0">
          <div class="w-full md:w-[45%]">
            <p-inputNumber
              mode="currency"
              currency="USD"
              locale="en-US"
              [(ngModel)]="purchaseValue"
              inputId="integeronly"
              [minFractionDigits]="0"
              (onBlur)="validateAvailablePoints()"
              [placeholder]="t('accumulationAndRedemption.home.onlyMoneyPlaceholder')"
            >
            </p-inputNumber>
          </div>
        </div>
        <div>
          <div class="mt-4 bg-pco-gray-10 rounded-lg px-6 py-4 md:pt-6 md:pl-8 md:mb-4">
            <small class="pco-gray-90">{{ t("accumulationAndRedemption.home.pointsMoneyrequired") }}</small>

            <form
              class="w-full md:w-[95%] flex flex-col justify-between md:px-0 md:py-0 pb-4 rounded-lg"
              [formGroup]="redemptionForm"
            >
              <div class="mt-6 md:mt-4 flex flex-col md:flex-row items-center justify-between">
                <pco-number-input
                  [label]="'Puntos'"
                  class="points-field"
                  formControlName="pointsToRedeem"
                  (change)="calculateCashToPay()"
                  icon="icon-pco-ui-pco"
                  [format]="true"
                  [value]="redemptionForm.value.pointsToRedeem"
                  (blur)="calculateCashToPayBlur()"
                  data-cy="pco-input-points-value"
                  data_cy_error_message="pco-input-points-error"
                ></pco-number-input>
                <div
                  class="block md:hidden mb-2 text-body text-xs w-full text-fg-disable text-size-12"
                  data-cy="pco-label-min-200-points"
                >
                  <p class="my-1">
                    {{ t("redemption.mimimum200Points") }}
                  </p>
                </div>
                <div class="text-display-md text-[#524D5B] !mx-3 hidden md:block">+</div>
                <pco-currency-input
                  [label]="'Dinero'"
                  class="cash-field"
                  formControlName="cashToPay"
                  [format]="true"
                  currency="COP"
                  [min]="0"
                  [max]="purchaseValue - convertionRatio * 200"
                  (change)="calculatePointsToRedeem()"
                  (blur)="calculatePointsToRedeemBlur()"
                  data-cy="pco-input-cash-to-pay"
                  data_cy_error_message="pco-error-cash-to-pay"
                  ngDefaultControl
                ></pco-currency-input>
              </div>
              <div
                class="hidden md:block text-body text-xs w-full text-fg-disable text-size-12"
                data-cy="pco-label-min-200-points"
              >
                <p class="my-1">
                  {{ t("redemption.mimimum200Points") }}
                </p>
              </div>
            </form>

            <div class="flex justify-end">
              <button
                pButton
                pRipple
                type="button"
                [label]="t('accumulationAndRedemption.home.onlyMoneyCta')"
                class="p-button-tertiary w-full md:!w-56 mb-5"
                [disabled]="!purchaseValue"
                (click)="goToTransactions('transaccion', 'POINTS_CASH')"
              ></button>
            </div>
          </div>
          <small>{{ t("accumulationAndRedemption.home.approximateValue") }}</small>
        </div>
      </p-tabPanel>
    </p-tabView>
  </div>
  <ng-template #purchase let-typeTransaction="type">
    <small>{{ t("accumulationAndRedemption.home.purchaseValue") }}</small>
    <div class="paymentAmount flex flex-col md:flex-row mt-0">
      <div class="w-full md:w-[60%]">
        <p-inputNumber
          mode="currency"
          currency="USD"
          locale="en-US"
          [(ngModel)]="purchaseValue"
          inputId="integeronly"
          [minFractionDigits]="0"
          [placeholder]="t('accumulationAndRedemption.home.onlyMoneyPlaceholder')"
        >
        </p-inputNumber>
      </div>
      <div class="w-full md:w-[40%] flex md:justify-end mt-4 md:mt-0">
        <button
          pButton
          pRipple
          type="button"
          [label]="t('accumulationAndRedemption.home.calculate')"
          class="p-ripple p-element w-full md:!w-36 p-button-outlined p-button-tertiary p-button p-component"
          (click)="typeTransaction === 'CASH' ? calculateAccumulation() : calculateRedemption()"
        ></button>
      </div>
    </div>
    <div *ngIf="showPointsToAccumulate">
      <div class="px-6 py-4 mt-4 bg-pco-gray-10 rounded-lg md:pt-6 md:pl-8 md:mb-4">
        <div class="flex flex-col md:flex-row items-center">
          <div class="text-pco-violet text-page-heading font-bold">
            {{
              typeTransaction === "CASH"
                ? t("accumulationAndRedemption.home.accumulate")
                : t("accumulationAndRedemption.home.redemption")
            }}
          </div>
          <div class="flex flex-row">
            <div>
              <i class="icon-pco icon-pco-ui-pco text-pco-violet icon-size-24 ml-1"></i>
            </div>
            <div class="text-pco-violet text-page-heading font-bold">
              {{ (typeTransaction === "CASH" ? pointsToAccumulate : pointsToRedeem) | number }}
              {{ t("accumulationAndRedemption.home.onlyMoneytext") }}
            </div>
          </div>
        </div>
        <div class="flex items-center md:justify-end">
          <button
            pButton
            pRipple
            type="button"
            [label]="t('accumulationAndRedemption.home.onlyMoneyCta')"
            class="p-button-tertiary my-6 w-full md:!w-56"
            (click)="goToNextPage('transaccion', typeTransaction)"
          ></button>
        </div>
      </div>
      <small>{{ t("accumulationAndRedemption.home.approximateValue") }}</small>
    </div>
  </ng-template>
</div>
